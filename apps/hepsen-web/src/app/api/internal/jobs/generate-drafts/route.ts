import { NextResponse, type NextRequest } from "next/server";
import {
  scoreTopic,
  runBlocklist,
  evaluate,
  llmCostUsd,
  DEFAULT_PRICING,
  buildTopicScoringTask,
  buildPresidentialContext,
  SYSTEM_POLICY,
  TopicScoringOutput,
  type TopicSignals,
  type MemoryExample,
} from "@hepsen/core";
import { getEnv } from "@/lib/env";
import { getServiceRoleClient } from "@/lib/supabase/server";
import { buildBudgetConfig } from "@/lib/budget-config";
import { loadBudgetState } from "@/lib/budget-state";
import { recordLlmUsage } from "@/lib/budget-usage";
import { getLlmGateway, ANTHROPIC_MODEL } from "@/lib/ai/gateway";
import { runStructured } from "@/lib/ai/run-structured";
import { clusterItems, type ClusterableItem } from "@/lib/topics/cluster";
import { computeTrendStrength, blocklistPenalty } from "@/lib/topics/signals";
import { generateDraftForTopic } from "@/lib/drafts/generate-draft";
import { writeAuditLog } from "@/lib/audit/log";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";

export const dynamic = "force-dynamic";

const LOOKBACK_HOURS = 24;
const DAILY_MAX_DRAFTS = 5;
/** topic_scoring LLM cagrisi icin kaba on-tahmin (gercek maliyet cagri sonrasi yazilir). */
const TOPIC_SCORING_ESTIMATE_TOKENS = { input: 3000, output: 1500 };

interface CollectedItemRow {
  id: string;
  user_id: string;
  source_id: string;
  title: string | null;
  content: string;
  published_at: string;
  sources: { name: string; reliability_level: number } | null;
}

// Vercel Cron istekleri GET ile gelir; POST manuel/lokal tetikleme icin ayni mantigi kullanir.
export { handleGenerateDraftsJob as GET, handleGenerateDraftsJob as POST };

async function handleGenerateDraftsJob(request: NextRequest) {
  const env = getEnv();
  if (!isAuthorizedCronRequest(request, env.CRON_SECRET)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getServiceRoleClient();
  const since = new Date(Date.now() - LOOKBACK_HOURS * 3_600_000).toISOString();

  const { data: candidates, error: candidatesError } = await supabase
    .from("collected_items")
    .select("id, user_id, source_id, title, content, published_at, sources(name, reliability_level)")
    .gte("published_at", since);

  if (candidatesError) {
    return NextResponse.json({ error: candidatesError.message }, { status: 500 });
  }

  const { data: linkedRows } = await supabase.from("topic_sources").select("collected_item_id");
  const linkedIds = new Set((linkedRows ?? []).map((r) => r.collected_item_id as string));
  const freshItems = ((candidates ?? []) as unknown as CollectedItemRow[]).filter((i) => !linkedIds.has(i.id));

  if (freshItems.length === 0) {
    await writeAuditLog({ userId: null, action: "generate_drafts_job_run", metadata: { reason: "no_fresh_items" } });
    return NextResponse.json({ topicsCreated: 0, draftsCreated: 0, reason: "no_fresh_items" });
  }

  const userId = freshItems[0]!.user_id;
  const budgetCfg = buildBudgetConfig();
  const gateway = getLlmGateway(env);

  // 1) Kumeleme (ayni gundemi anlatan farkli kaynakli ogeleri birlestir)
  const clusterable: ClusterableItem[] = freshItems.map((i) => ({
    id: i.id,
    sourceId: i.source_id,
    title: i.title ?? "",
    content: i.content,
  }));
  const clusters = clusterItems(clusterable);

  // 2) Butce guard + topic-scoring LLM cagrisi (kume basina bir temsilci item)
  const budgetState = await loadBudgetState(supabase);
  const estCost = llmCostUsd(DEFAULT_PRICING, ANTHROPIC_MODEL, TOPIC_SCORING_ESTIMATE_TOKENS);
  const scoringDecision = evaluate(budgetCfg, budgetState, "anthropic", "topic_scoring", estCost);
  if (!scoringDecision.allowed) {
    await writeAuditLog({ userId, action: "generate_drafts_job_blocked", metadata: { reason: scoringDecision.reason } });
    return NextResponse.json({ topicsCreated: 0, draftsCreated: 0, reason: scoringDecision.reason });
  }

  const itemById = new Map(freshItems.map((i) => [i.id, i]));
  const scorableItems = clusters.map((c) => {
    const rep = itemById.get(c.items[0]!.id)!;
    return {
      collectedItemId: rep.id,
      title: rep.title ?? "",
      content: rep.content,
      sourceName: rep.sources?.name ?? "bilinmeyen",
      publishedAt: rep.published_at,
    };
  });

  const { data: scoringOutput, usage: scoringUsage } = await runStructured(
    gateway,
    { systemCacheable: [SYSTEM_POLICY], task: buildTopicScoringTask(scorableItems), maxTokens: 4000 },
    TopicScoringOutput,
  );
  await recordLlmUsage(supabase, userId, "topic_scoring", scoringUsage);

  // 3) Deterministik sinyaller (sourceReliability, trendStrength, legalRiskPenalty) + scoreTopic
  const now = new Date();
  const scoredClusters = clusters
    .map((cluster) => {
      const rep = itemById.get(cluster.items[0]!.id)!;
      const llmSignals = scoringOutput.items.find((x) => x.collectedItemId === rep.id);
      if (!llmSignals) return null;

      const blocklistResult = runBlocklist(`${rep.title ?? ""} ${rep.content}`);
      const signals: TopicSignals = {
        healthRelevance: llmSignals.healthRelevance,
        sourceReliability: rep.sources?.reliability_level ?? 50,
        urgency: llmSignals.urgency,
        trendStrength: computeTrendStrength(new Date(rep.published_at), now),
        rightsImpact: llmSignals.rightsImpact,
        batmanRelevance: llmSignals.batmanRelevance,
        discussionPotential: llmSignals.discussionPotential,
        legalRiskPenalty: blocklistPenalty(blocklistResult.level),
        distinctSourceCount: cluster.distinctSourceCount,
        isHeavyAllegation: llmSignals.isHeavyAllegation,
      };

      return { cluster, rep, signals, category: llmSignals.category, scoreResult: scoreTopic(signals) };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  const eligible = scoredClusters
    .filter((c) => c.scoreResult.eligible)
    .sort((a, b) => b.scoreResult.score - a.scoreResult.score);

  // 4) Eligible konulari topics/topic_sources'a yaz
  const createdTopics: { id: string; title: string; summary: string; category: string }[] = [];
  for (const cand of eligible) {
    const { data: topicRow, error: topicError } = await supabase
      .from("topics")
      .insert({
        user_id: userId,
        title: cand.rep.title ?? "Başlıksız gündem",
        summary: cand.rep.content.slice(0, 500),
        category: cand.category,
        health_relevance_score: cand.signals.healthRelevance,
        source_reliability_score: cand.signals.sourceReliability,
        urgency_score: cand.signals.urgency,
        batman_relevance_score: cand.signals.batmanRelevance,
        trend_score: cand.signals.trendStrength,
        legal_risk_score: cand.signals.legalRiskPenalty,
        rights_impact_score: cand.signals.rightsImpact,
        discussion_potential_score: cand.signals.discussionPotential,
        final_score: cand.scoreResult.score,
        status: "scored",
      })
      .select("id")
      .single();

    if (topicError || !topicRow) continue;

    await supabase.from("topic_sources").insert(
      cand.cluster.items.map((it) => ({ topic_id: topicRow.id as string, collected_item_id: it.id })),
    );
    createdTopics.push({
      id: topicRow.id as string,
      title: cand.rep.title ?? "Başlıksız gündem",
      summary: cand.rep.content.slice(0, 500),
      category: cand.category,
    });
  }

  // 5) Gunluk hedef kadar taslak uret (max 5, gundem zayifsa sayi ZORLANMAZ)
  const topicsForDrafting = createdTopics.slice(0, DAILY_MAX_DRAFTS);

  const { data: memoryRows } = await supabase
    .from("presidential_memory")
    .select("memory_type, content, weight")
    .eq("is_active", true);
  const presidentialContext = buildPresidentialContext(
    (memoryRows ?? []).map(
      (m): MemoryExample => ({ memoryType: m.memory_type as string, content: m.content as string, weight: Number(m.weight) }),
    ),
  );

  const { data: history } = await supabase
    .from("time_slot_performance")
    .select("day_of_week, hour_bucket, sample_size, avg_engagement_rate, confidence_score");
  const accountHistory = (history ?? []).map((h) => ({
    dayOfWeek: h.day_of_week as number,
    hourBucket: h.hour_bucket as number,
    sampleSize: h.sample_size as number,
    avgEngagementRate: Number(h.avg_engagement_rate ?? 0),
    confidenceScore: Number(h.confidence_score ?? 0),
  }));

  const { data: xAccount } = await supabase
    .from("x_accounts")
    .select("connected_at")
    .is("revoked_at", null)
    .order("connected_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  const accountStartedAt = xAccount ? new Date(xAccount.connected_at as string) : new Date();

  let draftsCreated = 0;
  const draftErrors: string[] = [];
  for (const topic of topicsForDrafting) {
    try {
      const result = await generateDraftForTopic({
        supabase,
        gateway,
        userId,
        topic,
        presidentialContext,
        accountHistory,
        accountStartedAt,
      });
      if (result) draftsCreated++;
    } catch (e) {
      draftErrors.push(`${topic.title}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await writeAuditLog({
    userId,
    action: "generate_drafts_job_run",
    metadata: {
      itemsConsidered: freshItems.length,
      clustersScored: scoredClusters.length,
      topicsEligible: eligible.length,
      topicsCreated: createdTopics.length,
      draftsCreated,
      draftErrorCount: draftErrors.length,
    },
  });

  return NextResponse.json({
    topicsCreated: createdTopics.length,
    draftsCreated,
    errors: draftErrors,
  });
}
