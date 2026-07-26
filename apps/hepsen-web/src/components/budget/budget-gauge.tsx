import type { BudgetDecision } from "@hepsen/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TIER_LABEL: Record<BudgetDecision["tier"], string> = {
  normal: "Normal",
  soft: "Yumuşak sınır",
  warn: "Uyarı",
  exhausted: "Doldu",
  hard_stop: "Sert tavan",
};

const TIER_VARIANT: Record<BudgetDecision["tier"], "low" | "medium" | "high" | "blocked"> = {
  normal: "low",
  soft: "medium",
  warn: "medium",
  exhausted: "high",
  hard_stop: "blocked",
};

export function BudgetGauge({ decision, monthlyUsd }: { decision: BudgetDecision; monthlyUsd: number }) {
  const pct = Math.min(100, Math.max(0, decision.utilizationPct));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aylık Bütçe Kullanımı</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span>%{pct} — {monthlyUsd} USD/ay</span>
          <Badge variant={TIER_VARIANT[decision.tier]}>{TIER_LABEL[decision.tier]}</Badge>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-black/10">
          <div
            className="h-full rounded-full bg-hepsenBlue transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-hepsenNavy/60">{decision.reason}</p>
      </CardContent>
    </Card>
  );
}
