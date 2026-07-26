import { describe, it, expect } from "vitest";
import { suggestTiming, blendWeights } from "../src/timing/optimizer.js";

const now = new Date("2026-07-27T06:00:00+03:00");
const general: Record<number, number> = {};
for (let h = 0; h < 24; h++) general[h] = h >= 8 && h <= 21 ? 60 : 15;
general[12] = 85;
general[20] = 95;

describe("timing", () => {
  it("soguk baslangicta genel veriye agirlik verir", () => {
    const w = blendWeights(new Date("2026-07-15T00:00:00Z"), now);
    expect(w.coldStart).toBe(true);
    expect(w.general).toBeGreaterThan(w.account);
  });

  it("veri birikince hesabin kendi verisine gecer", () => {
    const w = blendWeights(new Date("2026-01-01T00:00:00Z"), now);
    expect(w.coldStart).toBe(false);
    expect(w.account).toBe(0.8);
  });

  it("iki alternatif saat doner", () => {
    const r = suggestTiming(
      { now, accountHistory: [], generalActivityByHour: general, contentCategory: "haber",
        urgency: 40, isCritical: false, accountStartedAt: new Date("2026-01-01T00:00:00Z") },
      () => 0.9,
    );
    expect(r.alternatives).toHaveLength(2);
    expect(r.primary.reason.length).toBeGreaterThan(10);
  });

  it("kritik aciklamada deney yapmaz", () => {
    const r = suggestTiming(
      { now, accountHistory: [], generalActivityByHour: general, contentCategory: "aciklama",
        urgency: 90, isCritical: true, accountStartedAt: new Date("2026-01-01T00:00:00Z") },
      () => 0.01,
    );
    expect(r.primary.isExperiment).toBe(false);
  });

  it("kesif kotasi devreye girebilir", () => {
    const r = suggestTiming(
      { now, accountHistory: [], generalActivityByHour: general, contentCategory: "haber",
        urgency: 40, isCritical: false, accountStartedAt: new Date("2026-01-01T00:00:00Z") },
      () => 0.01,
    );
    expect(r.primary.isExperiment).toBe(true);
  });
});
