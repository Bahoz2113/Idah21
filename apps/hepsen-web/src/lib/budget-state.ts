import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BudgetState, Provider } from "@hepsen/core";

/** Cari ayin budget_usage toplamlarini @hepsen/core'un BudgetState'ine cevirir. */
export async function loadBudgetState(supabase: SupabaseClient): Promise<BudgetState> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("budget_usage")
    .select("provider, estimated_cost_usd")
    .gte("occurred_at", startOfMonth.toISOString());

  const spentByProvider: Record<Provider, number> = { anthropic: 0, apify: 0, x_api: 0 };
  if (error || !data) return { spentByProvider, totalSpent: 0 };

  let totalSpent = 0;
  for (const row of data as { provider: Provider; estimated_cost_usd: number }[]) {
    spentByProvider[row.provider] += Number(row.estimated_cost_usd);
    totalSpent += Number(row.estimated_cost_usd);
  }
  return { spentByProvider, totalSpent };
}
