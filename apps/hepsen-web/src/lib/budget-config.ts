import "server-only";
import type { BudgetConfig } from "@hepsen/core";
import { getEnv } from "@/lib/env";

/**
 * packages/core DEFAULT_BUDGET, master prompt'un istedigi varsayilanlarla
 * (20/16/18/20 USD) uyumlu degil (bkz. plan Adim 4) — bu yuzden @hepsen/core
 * DEGISTIRILMEDEN, HEPSEN kendi BudgetConfig'ini env'den insa eder.
 * Master prompt md. 22: yumusak sinir %80, uyari siniri %90, kesin tavan %100.
 * Saglayici alt-butceleri (perProvider) bu turda esit-degil bir varsayimla
 * paylastirildi — bkz. docs/budget-model.md, gerektiginde ayarlanabilir.
 */
export function buildBudgetConfig(): BudgetConfig {
  const monthlyUsd = getEnv().MONTHLY_BUDGET_USD;
  const ratio = monthlyUsd / 20;
  return {
    monthlyUsd,
    softPct: 80,
    warnPct: 90,
    hardCeilingUsd: monthlyUsd,
    perProvider: {
      anthropic: 14 * ratio,
      apify: 4 * ratio,
      x_api: 2 * ratio,
    },
  };
}
