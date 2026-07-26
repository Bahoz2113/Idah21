import { describe, it, expect } from "vitest";
import { computeTrendStrength, blocklistPenalty } from "@/lib/topics/signals";

describe("computeTrendStrength", () => {
  const now = new Date("2026-07-26T12:00:00.000Z");

  it("6 saat icindeki icerige 100 verir", () => {
    expect(computeTrendStrength(new Date("2026-07-26T08:00:00.000Z"), now)).toBe(100);
  });

  it("48 saat ve uzerine 0 verir", () => {
    expect(computeTrendStrength(new Date("2026-07-20T00:00:00.000Z"), now)).toBe(0);
  });

  it("aradaki degerde lineer azalir", () => {
    const at27h = computeTrendStrength(new Date("2026-07-25T09:00:00.000Z"), now); // 27 saat once
    expect(at27h).toBeGreaterThan(0);
    expect(at27h).toBeLessThan(100);
  });
});

describe("blocklistPenalty", () => {
  it("risk seviyesine gore artan ceza doner", () => {
    expect(blocklistPenalty("LOW")).toBe(0);
    expect(blocklistPenalty("MEDIUM")).toBe(10);
    expect(blocklistPenalty("HIGH")).toBe(40);
    expect(blocklistPenalty("BLOCKED")).toBe(100);
  });
});
