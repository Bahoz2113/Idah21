import { describe, it, expect, vi, afterEach } from "vitest";
import { createAnthropicGateway } from "@/lib/ai/anthropic";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createAnthropicGateway", () => {
  it("systemCacheable bloklarina cache_control:ephemeral ekler", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        content: [{ type: "text", text: "{}" }],
        usage: { input_tokens: 5, output_tokens: 3, cache_read_input_tokens: 2 },
        model: "claude-sonnet-5",
      }),
    });
    vi.stubGlobal("fetch", fetchSpy);

    const gateway = createAnthropicGateway("gizli-anahtar", "claude-sonnet-5");
    const result = await gateway.complete({
      systemCacheable: ["SYSTEM POLICY", "PRESIDENTIAL CONTEXT"],
      task: "gorev metni",
      maxTokens: 100,
    });

    const [, init] = fetchSpy.mock.calls[0]!;
    const body = JSON.parse(init.body as string);
    expect(body.system).toHaveLength(2);
    expect(body.system[0]).toMatchObject({ text: "SYSTEM POLICY", cache_control: { type: "ephemeral" } });
    expect(body.system[1]).toMatchObject({ text: "PRESIDENTIAL CONTEXT", cache_control: { type: "ephemeral" } });
    expect(result.cachedTokens).toBe(2);
  });

  it("API anahtarini header'a koyar, govdeye yazmaz", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [], usage: { input_tokens: 0, output_tokens: 0 }, model: "m" }),
    });
    vi.stubGlobal("fetch", fetchSpy);
    await createAnthropicGateway("gizli-anahtar", "m").complete({ systemCacheable: [], task: "t", maxTokens: 1 });
    const [, init] = fetchSpy.mock.calls[0]!;
    expect(init.headers["x-api-key"]).toBe("gizli-anahtar");
    expect(init.body as string).not.toContain("gizli-anahtar");
  });

  it("basarisiz yanitta hata firlatir ve anahtari mesaja yazmaz", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    try {
      await createAnthropicGateway("gizli-anahtar", "m").complete({ systemCacheable: [], task: "t", maxTokens: 1 });
      throw new Error("hata beklenirdi");
    } catch (e) {
      expect((e as Error).message).toMatch(/HTTP 401/);
      expect((e as Error).message).not.toContain("gizli-anahtar");
    }
  });
});
