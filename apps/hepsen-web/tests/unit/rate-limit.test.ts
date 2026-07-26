import { describe, it, expect } from "vitest";
import { checkRateLimit } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("limit asilana kadar izin verir, sonra reddeder", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    expect(checkRateLimit(key, 3, 60_000).allowed).toBe(false);
  });

  it("farkli key'ler birbirini etkilemez", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    expect(checkRateLimit(a, 1, 60_000).allowed).toBe(true);
    expect(checkRateLimit(b, 1, 60_000).allowed).toBe(true);
  });
});
