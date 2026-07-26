import type { RiskLevel } from "@hepsen/core";

const FRESH_HOURS = 6;
const STALE_HOURS = 48;

/** Yenilik bazli trend sinyali — deterministik, LLM'e sorulmaz. */
export function computeTrendStrength(publishedAt: Date, now: Date): number {
  const hours = (now.getTime() - publishedAt.getTime()) / 3_600_000;
  if (hours <= FRESH_HOURS) return 100;
  if (hours >= STALE_HOURS) return 0;
  const pct = 1 - (hours - FRESH_HOURS) / (STALE_HOURS - FRESH_HOURS);
  return Math.round(pct * 100 * 10) / 10;
}

const PENALTY_BY_LEVEL: Record<RiskLevel, number> = {
  LOW: 0,
  MEDIUM: 10,
  HIGH: 40,
  BLOCKED: 100,
};

/** runBlocklist() sonucunu scoreTopic()'in legalRiskPenalty'sine cevirir. */
export function blocklistPenalty(level: RiskLevel): number {
  return PENALTY_BY_LEVEL[level];
}
