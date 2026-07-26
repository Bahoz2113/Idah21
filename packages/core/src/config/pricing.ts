/**
 * Fiyat tablosu. Faz 0'da resmi kaynaklardan DOGRULANIP guncellenir.
 * Fiyatlar hicbir yere gomulmez; her maliyet hesabi buradan okur.
 */
export type Provider = "anthropic" | "apify" | "x_api";

export interface PricingTable {
  verifiedAt: string | null;
  anthropic: {
    models: Record<string, { input: number; output: number; cacheRead: number; cacheWrite: number }>;
    batchMultiplier: number;
  };
  apify: { costPer1kTweets: number; freeMonthlyCreditUsd: number };
  xApi: {
    postCreateNoLink: number;
    postCreateWithLink: number;
    replyCreate: number;
    readOwnPost: number;
    readThirdPartyPost: number;
  };
}

/** VARSAYILAN — Faz 0 dogrulamasindan once yalnizca tahmindir. */
export const DEFAULT_PRICING: PricingTable = {
  verifiedAt: null,
  anthropic: {
    models: {
      "claude-haiku-4-5": { input: 1.0, output: 5.0, cacheRead: 0.1, cacheWrite: 1.25 },
      "claude-sonnet-5": { input: 3.0, output: 15.0, cacheRead: 0.3, cacheWrite: 3.75 },
    },
    batchMultiplier: 0.5,
  },
  apify: { costPer1kTweets: 0.25, freeMonthlyCreditUsd: 5.0 },
  xApi: {
    postCreateNoLink: 0.015,
    postCreateWithLink: 0.2,
    replyCreate: 0.015,
    readOwnPost: 0.001,
    readThirdPartyPost: 0.005,
  },
};

export function llmCostUsd(
  p: PricingTable,
  model: string,
  t: { input: number; output: number; cacheRead?: number; cacheWrite?: number },
  batched = false,
): number {
  const m = p.anthropic.models[model];
  if (!m) throw new Error(`Bilinmeyen model: ${model}`);
  const raw =
    (t.input / 1e6) * m.input +
    (t.output / 1e6) * m.output +
    ((t.cacheRead ?? 0) / 1e6) * m.cacheRead +
    ((t.cacheWrite ?? 0) / 1e6) * m.cacheWrite;
  return raw * (batched ? p.anthropic.batchMultiplier : 1);
}

export function apifyCostUsd(p: PricingTable, tweets: number): number {
  return (tweets / 1000) * p.apify.costPer1kTweets;
}

export function xPostCostUsd(p: PricingTable, kind: "post" | "reply", hasLink: boolean): number {
  if (hasLink) return p.xApi.postCreateWithLink;
  return kind === "reply" ? p.xApi.replyCreate : p.xApi.postCreateNoLink;
}
