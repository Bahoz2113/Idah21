import { evaluate, type BudgetState, type Provider } from "@hepsen/core";
import { getServerSupabase } from "@/lib/supabase/server";
import { buildBudgetConfig } from "@/lib/budget-config";
import { BudgetGauge } from "@/components/budget/budget-gauge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

async function loadBudgetState(): Promise<BudgetState> {
  const supabase = getServerSupabase();
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

export default async function TodayPage() {
  const cfg = buildBudgetConfig();
  const state = await loadBudgetState();
  // Bilgilendirme amaçlı: bu ayki genel durumu göstermek için 0 USD'lik bir
  // "discovery_query" değerlendirmesi kullanılıyor (gerçek harcama tetiklemez).
  const decision = evaluate(cfg, state, "anthropic", "discovery_query", 0);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Bugün</h1>

      <BudgetGauge decision={decision} monthlyUsd={cfg.monthlyUsd} />

      <Card>
        <CardHeader>
          <CardTitle>Günün sağlık gündemi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-hepsenNavy/60">
            Gündem toplama ve puanlama motoru Faz 2&apos;de aktif olacak.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Onay bekleyen taslak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-hepsenNavy/60">Taslak üretimi Faz 2&apos;de aktif olacak.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sıradaki planlı paylaşım</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-hepsenNavy/60">Zamanlama/yayın Faz 3&apos;te aktif olacak.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
