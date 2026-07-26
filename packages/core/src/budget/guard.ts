/** Butce koruma motoru — master prompt md. 28 */
import type { Provider } from "../config/pricing.js";

export interface BudgetConfig {
  monthlyUsd: number;
  softPct: number;   // 70
  warnPct: number;   // 85
  hardCeilingUsd: number;
  perProvider: Record<Provider, number>;
}

export const DEFAULT_BUDGET: BudgetConfig = {
  monthlyUsd: 5,
  softPct: 70,
  warnPct: 85,
  hardCeilingUsd: 8,
  perProvider: { apify: 2.85, anthropic: 2.5, x_api: 2.55 },
};

export type Operation =
  | "discovery_query"      // Apify kesif sorgusu
  | "benchmark"            // Haftalik benchmark
  | "topic_scoring"
  | "draft_generation"
  | "regeneration"
  | "metrics_read"
  | "publish"              // ONAYLI ICERIK YAYINI — asla butce yuzunden durmaz
  | "reply_publish";

export interface BudgetState {
  spentByProvider: Record<Provider, number>;
  totalSpent: number;
}

export interface BudgetDecision {
  allowed: boolean;
  reason: string;
  utilizationPct: number;
  tier: "normal" | "soft" | "warn" | "exhausted" | "hard_stop";
}

/** Yayin islemleri icin ayrilan guvenli rezerv. Butce dolsa da yayin durmaz. */
const PUBLISH_OPS: Operation[] = ["publish", "reply_publish"];

export function evaluate(
  cfg: BudgetConfig,
  state: BudgetState,
  provider: Provider,
  op: Operation,
  estimatedCostUsd: number,
): BudgetDecision {
  const projected = state.totalSpent + estimatedCostUsd;
  const pct = Math.round((state.totalSpent / cfg.monthlyUsd) * 1000) / 10;

  // Sert tavan: hicbir istisna yok
  if (projected > cfg.hardCeilingUsd) {
    return {
      allowed: false,
      reason: `Sert tavan ${cfg.hardCeilingUsd} USD asilacak. Tum dis cagrilar durduruldu.`,
      utilizationPct: pct,
      tier: "hard_stop",
    };
  }

  // Onayli icerigin yayini butce yuzunden durmaz
  if (PUBLISH_OPS.includes(op)) {
    return { allowed: true, reason: "Yayin rezervi korunuyor.", utilizationPct: pct, tier: tierOf(cfg, pct) };
  }

  const provSpent = state.spentByProvider[provider] ?? 0;
  const provCap = cfg.perProvider[provider];
  if (provSpent + estimatedCostUsd > provCap) {
    return {
      allowed: false,
      reason: `${provider} alt butcesi (${provCap} USD) doldu.`,
      utilizationPct: pct,
      tier: "exhausted",
    };
  }

  const tier = tierOf(cfg, pct);

  if (tier === "exhausted") {
    return { allowed: false, reason: "Aylik butce doldu. Kritik olmayan veri toplama durduruldu.", utilizationPct: pct, tier };
  }
  if (tier === "warn" && (op === "discovery_query" || op === "benchmark")) {
    return { allowed: false, reason: `Butce %${cfg.warnPct} asildi. Benchmark ve kesif isleri kapatildi.`, utilizationPct: pct, tier };
  }
  if (tier === "soft" && op === "discovery_query") {
    return { allowed: false, reason: `Butce %${cfg.softPct} asildi. Kesif sorgulari kapatildi.`, utilizationPct: pct, tier };
  }

  return { allowed: true, reason: "Butce icinde.", utilizationPct: pct, tier };
}

function tierOf(cfg: BudgetConfig, pct: number): BudgetDecision["tier"] {
  if (pct >= 100) return "exhausted";
  if (pct >= cfg.warnPct) return "warn";
  if (pct >= cfg.softPct) return "soft";
  return "normal";
}
