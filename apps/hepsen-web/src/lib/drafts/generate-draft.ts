import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  runBlocklist,
  combineRisk,
  canPublish,
  scoreHook,
  selectHashtags,
  suggestTiming,
  transition,
  DraftGenerationOutput,
  LegalReviewOutput,
  ToneReviewOutput,
  buildDraftPostTask,
  buildLegalReviewTask,
  buildToneReviewTask,
  SYSTEM_POLICY,
  type SlotPerformance,
  type HashtagCandidate,
  type RiskLevel,
} from "@hepsen/core";
import type { LlmGateway } from "@/lib/ai/types";
import { runStructured } from "@/lib/ai/run-structured";
import { recordLlmUsage } from "@/lib/budget-usage";

export interface TopicForDraft {
  id: string;
  title: string;
  summary: string;
  category: string;
}

export interface GenerateDraftParams {
  supabase: SupabaseClient;
  gateway: LlmGateway;
  userId: string;
  topic: TopicForDraft;
  presidentialContext: string;
  accountHistory: SlotPerformance[];
  accountStartedAt: Date;
}

export interface GenerateDraftResult {
  draftId: string;
  status: string;
  riskLevel: RiskLevel;
}

/**
 * Master prompt md. 11 "Taslak uretim sirasi": kaynak -> ilk taslak (AI) ->
 * iki asamali hukuk taramasi (blocklist ONCE, LLM SONRA, blocklist ezer) ->
 * ton/anti-AI kontrolu -> hook kontrolu -> hashtag -> zamanlama -> durum atama.
 * HER LLM cagrisi sonrasi gercek maliyet budget_usage'a yazilir.
 */
export async function generateDraftForTopic(params: GenerateDraftParams): Promise<GenerateDraftResult | null> {
  const { supabase, gateway, userId, topic, presidentialContext, accountHistory, accountStartedAt } = params;

  const draftTask = buildDraftPostTask({
    topicTitle: topic.title,
    topicSummary: topic.summary,
    facts: [{ url: "", publishedAt: new Date().toISOString(), claim: topic.summary, verified: true }],
    uncertainties: [],
    contentCategory: topic.category,
    benchmarkHints: [],
  });
  const { data: draftOutput, usage: draftUsage } = await runStructured(
    gateway,
    { systemCacheable: [SYSTEM_POLICY, presidentialContext], task: draftTask, maxTokens: 1500 },
    DraftGenerationOutput,
  );
  await recordLlmUsage(supabase, userId, "draft_generation", draftUsage);

  // ASAMA 1 (deterministik, ONCE calisir, LLM'i ezer) + ASAMA 2 (LLM legal-review)
  const blocklistResult = runBlocklist(draftOutput.text);
  const legalTask = buildLegalReviewTask(
    draftOutput.text,
    blocklistResult.hits.map((h) => h.reason),
  );
  const { data: legalOutput, usage: legalUsage } = await runStructured(
    gateway,
    { systemCacheable: [SYSTEM_POLICY], task: legalTask, maxTokens: 800 },
    LegalReviewOutput,
  );
  await recordLlmUsage(supabase, userId, "draft_generation", legalUsage);
  const riskLevel: RiskLevel = combineRisk(blocklistResult, legalOutput.level);

  const toneTask = buildToneReviewTask(draftOutput.text);
  const { data: toneOutput, usage: toneUsage } = await runStructured(
    gateway,
    { systemCacheable: [SYSTEM_POLICY], task: toneTask, maxTokens: 800 },
    ToneReviewOutput,
  );
  await recordLlmUsage(supabase, userId, "draft_generation", toneUsage);

  const finalText = toneOutput.humanStyleScore < 60 && toneOutput.rewrite ? toneOutput.rewrite : draftOutput.text;
  const hookResult = scoreHook(finalText);

  // Faz 2'de gercek trend/kullanim verisi yok; muhafazakar sabit sinyallerle
  // puanlama yapilir — genelde esigin altinda kalip hashtag'siz yayin tercih
  // edilir (master prompt: "hashtag kullanilmamasi bazi icerklerde gecerli").
  const hashtagCandidates: HashtagCandidate[] = draftOutput.hashtags.map((tag) => ({
    tag,
    signals: {
      topicRelevance: 70,
      currentVelocity: 30,
      healthAudienceUsage: 40,
      reachPotential: 40,
      brandAlignment: 60,
      spamPenalty: 0,
    },
  }));
  const hashtagDecision = selectHashtags(hashtagCandidates);

  const timing = suggestTiming({
    now: new Date(),
    accountHistory,
    generalActivityByHour: DEFAULT_GENERAL_ACTIVITY_BY_HOUR,
    contentCategory: topic.category,
    urgency: 60,
    isCritical: riskLevel === "HIGH" || riskLevel === "BLOCKED",
    accountStartedAt,
  });

  const status = canPublish(riskLevel) ? transition("DRAFT", "submit_for_review") : transition("DRAFT", "block_by_risk");

  const { data: inserted, error } = await supabase
    .from("drafts")
    .insert({
      user_id: userId,
      topic_id: topic.id,
      content_type: "post",
      text: finalText,
      alt_hooks: draftOutput.altHooks,
      hashtags: hashtagDecision.selected,
      source_summary: draftOutput.sourceSummary,
      tone_score: toneOutput.toneScore,
      corporate_alignment_score: toneOutput.corporateAlignmentScore,
      human_style_score: toneOutput.humanStyleScore,
      hook_strength: hookResult.score,
      legal_risk_level: riskLevel,
      legal_risk_reasons: legalOutput.reasons,
      blocklist_hits: blocklistResult.hits,
      recommended_publish_at: timing.primary.publishAt.toISOString(),
      timing_score: timing.primary.score,
      timing_confidence: timing.primary.confidence,
      timing_reason: timing.primary.reason,
      status,
      prompt_version: draftOutput.promptVersion,
    })
    .select("id")
    .single();

  if (error || !inserted) return null;
  return { draftId: inserted.id as string, status, riskLevel };
}

/**
 * Gercek hesap gecmisi olmadan (soguk baslangic) makul bir varsayim:
 * Turkiye saglik kitlesinin genel olarak aktif oldugu aksam saatleri agirlikli.
 * Faz 4'te gercek benchmark verisiyle degistirilecek (bkz. docs/budget-model.md benzeri not).
 */
const DEFAULT_GENERAL_ACTIVITY_BY_HOUR: Record<number, number> = {
  7: 40, 8: 55, 9: 60, 10: 55, 11: 50, 12: 60, 13: 55, 14: 50,
  15: 55, 16: 60, 17: 65, 18: 70, 19: 80, 20: 85, 21: 75, 22: 60, 23: 40,
};
