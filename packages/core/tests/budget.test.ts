import { describe, it, expect } from "vitest";
import { evaluate, DEFAULT_BUDGET } from "../src/budget/guard.js";
import { DEFAULT_PRICING, llmCostUsd, apifyCostUsd, xPostCostUsd } from "../src/config/pricing.js";

const state = (total: number, apify = 0, anthropic = 0, x = 0) => ({
  totalSpent: total,
  spentByProvider: { apify, anthropic, x_api: x },
});

describe("butce guard", () => {
  it("normal seviyede izin verir", () => {
    expect(evaluate(DEFAULT_BUDGET, state(1), "apify", "discovery_query", 0.1).allowed).toBe(true);
  });

  it("%70'te kesif sorgularini keser", () => {
    const d = evaluate(DEFAULT_BUDGET, state(3.6), "apify", "discovery_query", 0.1);
    expect(d.allowed).toBe(false);
    expect(d.tier).toBe("soft");
  });

  it("%85'te benchmark isini keser", () => {
    const d = evaluate(DEFAULT_BUDGET, state(4.3), "apify", "benchmark", 0.1);
    expect(d.allowed).toBe(false);
    expect(d.tier).toBe("warn");
  });

  it("butce dolsa bile ONAYLI YAYIN durmaz", () => {
    expect(evaluate(DEFAULT_BUDGET, state(5.5), "x_api", "publish", 0.015).allowed).toBe(true);
    expect(evaluate(DEFAULT_BUDGET, state(5.5), "x_api", "reply_publish", 0.015).allowed).toBe(true);
  });

  it("sert tavan yayini bile durdurur", () => {
    const d = evaluate(DEFAULT_BUDGET, state(8.0), "x_api", "publish", 0.02);
    expect(d.allowed).toBe(false);
    expect(d.tier).toBe("hard_stop");
  });

  it("provider alt butcesini ayri uygular", () => {
    const d = evaluate(DEFAULT_BUDGET, state(2.9, 2.85), "apify", "topic_scoring", 0.1);
    expect(d.allowed).toBe(false);
    expect(d.reason).toContain("apify");
  });
});

describe("fiyat hesaplari", () => {
  it("batch %50 indirim uygular", () => {
    const full = llmCostUsd(DEFAULT_PRICING, "claude-haiku-4-5", { input: 1e6, output: 1e5 });
    const batched = llmCostUsd(DEFAULT_PRICING, "claude-haiku-4-5", { input: 1e6, output: 1e5 }, true);
    expect(batched).toBeCloseTo(full * 0.5, 6);
  });

  it("linkli gonderi cok daha pahali", () => {
    expect(xPostCostUsd(DEFAULT_PRICING, "post", true)).toBeGreaterThan(
      xPostCostUsd(DEFAULT_PRICING, "post", false) * 10,
    );
  });

  it("aylik apify hedefi ucretsiz kredi icinde", () => {
    const monthly = apifyCostUsd(DEFAULT_PRICING, 300 * 30 + 600 * 4);
    expect(monthly).toBeLessThan(DEFAULT_PRICING.apify.freeMonthlyCreditUsd);
  });
});
