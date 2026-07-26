import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { canPublish, transition, type RiskLevel, type SlotPerformance, type DraftStatus } from "@hepsen/core";
import type { LlmGateway } from "@/lib/ai/types";
import { runProductionPipeline, type TopicForDraft } from "@/lib/drafts/generate-draft";
import { REGENERATE_HINTS, type RegenerateHintKey } from "@/lib/drafts/regenerate-hints";

export interface RegenerateDraftParams {
  supabase: SupabaseClient;
  gateway: LlmGateway;
  userId: string;
  draftId: string;
  hint?: RegenerateHintKey;
  presidentialContext: string;
  accountHistory: SlotPerformance[];
  accountStartedAt: Date;
}

export interface RegenerateDraftResult {
  status: DraftStatus;
  riskLevel: RiskLevel;
  version: number;
}

interface DraftRow {
  id: string;
  status: DraftStatus;
  version: number;
  text: string;
  topic_id: string | null;
}

interface TopicRow {
  id: string;
  title: string;
  summary: string;
  category: string | null;
}

/**
 * Master prompt md. 21 ikincil menu: "daha kararli/kisa/dogal/kurumsal, riski
 * azalt, hashtag degistir". Mevcut taslak SATIRI guncellenir (version++) —
 * yeni satir acilmaz (draft_feedback/publications FK'leri draftId'ye bagli).
 * PUBLISHING/PUBLISHED durumundan cagrilirsa transition() DraftStateError
 * firlatir — yayinlanmis/yayinlanmakta olan bir taslak yeniden uretilemez.
 */
export async function regenerateDraft(params: RegenerateDraftParams): Promise<RegenerateDraftResult | null> {
  const { supabase, gateway, userId, draftId, hint, presidentialContext, accountHistory, accountStartedAt } = params;

  const { data: draft } = await supabase
    .from("drafts")
    .select("id, status, version, text, topic_id")
    .eq("id", draftId)
    .single<DraftRow>();
  if (!draft || !draft.topic_id) return null;

  // Gecersiz durumdan (PUBLISHING/PUBLISHED) cagrilirsa burada DraftStateError firlar.
  const statusAfterEdit = transition(draft.status, "edit");

  const { data: topicRow } = await supabase
    .from("topics")
    .select("id, title, summary, category")
    .eq("id", draft.topic_id)
    .single<TopicRow>();
  if (!topicRow) return null;

  const topic: TopicForDraft = {
    id: topicRow.id,
    title: topicRow.title,
    summary: topicRow.summary,
    category: topicRow.category ?? "genel",
  };

  const result = await runProductionPipeline({
    supabase,
    gateway,
    userId,
    topic,
    presidentialContext,
    accountHistory,
    accountStartedAt,
    regenerationHint: hint ? REGENERATE_HINTS[hint] : undefined,
  });

  const finalStatus: DraftStatus = canPublish(result.riskLevel)
    ? statusAfterEdit === "DRAFT"
      ? transition("DRAFT", "submit_for_review")
      : statusAfterEdit
    : transition(statusAfterEdit, "block_by_risk");

  const newVersion = draft.version + 1;

  const { error } = await supabase
    .from("drafts")
    .update({
      text: result.text,
      alt_hooks: result.altHooks,
      hashtags: result.hashtags,
      source_summary: result.sourceSummary,
      tone_score: result.toneScore,
      corporate_alignment_score: result.corporateAlignmentScore,
      human_style_score: result.humanStyleScore,
      hook_strength: result.hookStrength,
      legal_risk_level: result.riskLevel,
      legal_risk_reasons: result.legalRiskReasons,
      blocklist_hits: result.blocklistHits,
      recommended_publish_at: result.recommendedPublishAt,
      timing_score: result.timingScore,
      timing_confidence: result.timingConfidence,
      timing_reason: result.timingReason,
      status: finalStatus,
      version: newVersion,
      approved_text_hash: null,
      prompt_version: result.promptVersion,
    })
    .eq("id", draftId);
  if (error) return null;

  await supabase.from("draft_feedback").insert({
    user_id: userId,
    draft_id: draftId,
    action: "regenerate",
    free_text: hint ?? null,
    original_text: draft.text,
    final_text: result.text,
  });

  return { status: finalStatus, riskLevel: result.riskLevel, version: newVersion };
}
