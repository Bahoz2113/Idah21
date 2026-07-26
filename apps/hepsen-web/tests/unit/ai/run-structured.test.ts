import { describe, it, expect, vi } from "vitest";
import { z } from "zod";
import { runStructured } from "@/lib/ai/run-structured";
import type { LlmGateway, LlmCallResult } from "@/lib/ai/types";

const schema = z.object({ ok: z.literal(true), value: z.number() });

function fakeResult(raw: string): LlmCallResult {
  return { raw, inputTokens: 10, outputTokens: 5, cachedTokens: 0, model: "test-model" };
}

describe("runStructured", () => {
  it("gecerli JSON'u ilk denemede kabul eder, retry yapmaz", async () => {
    const complete = vi.fn().mockResolvedValue(fakeResult(JSON.stringify({ ok: true, value: 1 })));
    const gateway: LlmGateway = { complete };
    const result = await runStructured(gateway, { systemCacheable: [], task: "t", maxTokens: 10 }, schema);
    expect(result.data).toEqual({ ok: true, value: 1 });
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it("kod blogu ile sarili JSON'u temizleyip parse eder", async () => {
    const complete = vi.fn().mockResolvedValue(fakeResult("```json\n" + JSON.stringify({ ok: true, value: 2 }) + "\n```"));
    const gateway: LlmGateway = { complete };
    const result = await runStructured(gateway, { systemCacheable: [], task: "t", maxTokens: 10 }, schema);
    expect(result.data.value).toBe(2);
  });

  it("ilk cikti gecersizse bir kez retry yapar ve basarili olursa doner", async () => {
    const complete = vi
      .fn()
      .mockResolvedValueOnce(fakeResult("bu gecerli json degil"))
      .mockResolvedValueOnce(fakeResult(JSON.stringify({ ok: true, value: 3 })));
    const gateway: LlmGateway = { complete };
    const result = await runStructured(gateway, { systemCacheable: [], task: "t", maxTokens: 10 }, schema);
    expect(result.data.value).toBe(3);
    expect(complete).toHaveBeenCalledTimes(2);
    // retry gorevine onceki hata özeti eklenmis olmali
    expect(complete.mock.calls[1]![0].task).toContain("ÖNCEKİ ÇIKTI GEÇERSİZDİ");
  });

  it("iki deneme de basarisizsa hata firlatir", async () => {
    const complete = vi.fn().mockResolvedValue(fakeResult("gecersiz"));
    const gateway: LlmGateway = { complete };
    await expect(
      runStructured(gateway, { systemCacheable: [], task: "t", maxTokens: 10 }, schema),
    ).rejects.toThrow();
    expect(complete).toHaveBeenCalledTimes(2);
  });

  it("token kullanimini iki cagridan toplar (retry durumunda)", async () => {
    const complete = vi
      .fn()
      .mockResolvedValueOnce({ raw: "x", inputTokens: 10, outputTokens: 5, cachedTokens: 2, model: "m" })
      .mockResolvedValueOnce({
        raw: JSON.stringify({ ok: true, value: 1 }),
        inputTokens: 12,
        outputTokens: 6,
        cachedTokens: 8,
        model: "m",
      });
    const gateway: LlmGateway = { complete };
    const result = await runStructured(gateway, { systemCacheable: [], task: "t", maxTokens: 10 }, schema);
    expect(result.usage.inputTokens).toBe(22);
    expect(result.usage.outputTokens).toBe(11);
    expect(result.usage.cachedTokens).toBe(10);
  });
});
