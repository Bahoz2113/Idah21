import { describe, it, expect, vi, afterEach } from "vitest";
import { getLlmGateway, ANTHROPIC_MODEL } from "@/lib/ai/gateway";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getLlmGateway", () => {
  it("anthropic provider icin gercek gateway doner ve fetch cagirir", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          content: [{ type: "text", text: "{}" }],
          usage: { input_tokens: 1, output_tokens: 1 },
          model: ANTHROPIC_MODEL,
        }),
      }),
    );
    const gateway = getLlmGateway({ LLM_PROVIDER: "anthropic", ANTHROPIC_API_KEY: "key" });
    const result = await gateway.complete({ systemCacheable: [], task: "t", maxTokens: 10 });
    expect(result.model).toBe(ANTHROPIC_MODEL);
  });

  it("openai provider icin 'uygulanmadi' hatasi firlatan gateway doner", async () => {
    const gateway = getLlmGateway({ LLM_PROVIDER: "openai", ANTHROPIC_API_KEY: "key" });
    await expect(gateway.complete({ systemCacheable: [], task: "t", maxTokens: 10 })).rejects.toThrow(
      /henüz uygulanmadı/,
    );
  });

  it("gemini provider icin 'uygulanmadi' hatasi firlatan gateway doner", async () => {
    const gateway = getLlmGateway({ LLM_PROVIDER: "gemini", ANTHROPIC_API_KEY: "key" });
    await expect(gateway.complete({ systemCacheable: [], task: "t", maxTokens: 10 })).rejects.toThrow(
      /henüz uygulanmadı/,
    );
  });
});
