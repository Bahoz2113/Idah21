import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { llmCostUsd, apifyCostUsd, DEFAULT_PRICING, type Provider } from "@hepsen/core";
import type { LlmCallResult } from "@/lib/ai/types";

/** Bir LLM cagrisinin gercek maliyetini budget_usage'a yazar. */
export async function recordLlmUsage(
  supabase: SupabaseClient,
  userId: string,
  operation: string,
  usage: LlmCallResult,
): Promise<void> {
  const cost = llmCostUsd(DEFAULT_PRICING, usage.model, {
    input: usage.inputTokens,
    output: usage.outputTokens,
    cacheRead: usage.cachedTokens,
  });
  await supabase.from("budget_usage").insert({
    user_id: userId,
    provider: "anthropic" as Provider,
    operation,
    model: usage.model,
    input_tokens: usage.inputTokens,
    output_tokens: usage.outputTokens,
    cached_tokens: usage.cachedTokens,
    estimated_cost_usd: cost,
  });
}

/** Apify toplama maliyetini gercek sonuc sayisina gore budget_usage'a yazar. */
export async function recordApifyUsage(
  supabase: SupabaseClient,
  userId: string,
  itemCount: number,
): Promise<void> {
  const cost = apifyCostUsd(DEFAULT_PRICING, itemCount);
  await supabase.from("budget_usage").insert({
    user_id: userId,
    provider: "apify" as Provider,
    operation: "discovery_query",
    units: itemCount,
    estimated_cost_usd: cost,
  });
}
