import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPresidentialContext, type MemoryExample, type SlotPerformance } from "@hepsen/core";

export interface DraftGenerationContext {
  presidentialContext: string;
  accountHistory: SlotPerformance[];
  accountStartedAt: Date;
}

/** generate-drafts job'i ve regenerate route'u ortak kullanir. */
export async function loadDraftGenerationContext(supabase: SupabaseClient): Promise<DraftGenerationContext> {
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
  const accountHistory: SlotPerformance[] = (history ?? []).map((h) => ({
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

  return { presidentialContext, accountHistory, accountStartedAt };
}
