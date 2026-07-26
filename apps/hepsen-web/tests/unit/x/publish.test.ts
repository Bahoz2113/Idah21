import { describe, it, expect, vi, afterEach } from "vitest";
import { postTweet } from "@/lib/x/client";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("postTweet", () => {
  it("basarili yanitta gonderi id'sini doner", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { id: "1234567890" } }) }),
    );
    const result = await postTweet("gizli-token", "Nöbet ücretleri ödenmedi.");
    expect(result).toEqual({ id: "1234567890" });
  });

  it("govdeyi dogru formatta gonderir (yalnizca text)", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: { id: "1" } }) });
    vi.stubGlobal("fetch", fetchSpy);
    await postTweet("tok", "merhaba dünya");
    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe("https://api.x.com/2/tweets");
    expect(JSON.parse(init.body as string)).toEqual({ text: "merhaba dünya" });
    expect(init.headers.Authorization).toBe("Bearer tok");
  });

  it("basarisiz yanitta hata firlatir, token'i mesaja yazmaz", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 403 }));
    try {
      await postTweet("gizli-token", "metin");
      throw new Error("hata beklenirdi");
    } catch (e) {
      expect((e as Error).message).toMatch(/HTTP 403/);
      expect((e as Error).message).not.toContain("gizli-token");
    }
  });
});
