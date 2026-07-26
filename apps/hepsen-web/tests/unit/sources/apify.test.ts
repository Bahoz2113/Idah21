import { describe, it, expect, vi, afterEach } from "vitest";
import { normalizeApifyItem, collectFromApify, runApifyActorSync } from "@/lib/sources/apify";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("normalizeApifyItem", () => {
  it("gecerli ogeyi NormalizedItem'a cevirir", () => {
    const item = normalizeApifyItem({
      id: "123",
      url: "https://x.com/foo/status/123",
      fullText: "Örnek tweet metni",
      authorUsername: "saglikhaber",
      createdAt: "2026-07-26T06:00:00.000Z",
    });
    expect(item).toMatchObject({
      externalId: "123",
      platform: "x",
      content: "Örnek tweet metni",
      authorHandle: "saglikhaber",
    });
  });

  it("text veya url eksikse null doner", () => {
    expect(normalizeApifyItem({ id: "1" })).toBeNull();
    expect(normalizeApifyItem({ url: "https://x.com/1" })).toBeNull();
  });
});

describe("collectFromApify", () => {
  it("token veya actor id yoksa sessizce bos dizi doner, fetch cagirmaz", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const result = await collectFromApify(
      { url_or_query: "sağlık çalışanları", name: "X Apify" },
      { APIFY_API_TOKEN: "", APIFY_X_ACTOR_ID: "" },
    );
    expect(result).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("token varsa Apify'i cagirir ve sonucu normalize eder", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [
          { id: "1", url: "https://x.com/a/1", fullText: "metin 1", authorUsername: "a" },
          { id: "2", url: "https://x.com/a/2" }, // text yok, elenir
        ],
      }),
    );
    const result = await collectFromApify(
      { url_or_query: "test", name: "X Apify" },
      { APIFY_API_TOKEN: "tok", APIFY_X_ACTOR_ID: "actor1" },
    );
    expect(result).toHaveLength(1);
    expect(result[0]!.externalId).toBe("1");
  });
});

describe("runApifyActorSync", () => {
  it("basarisiz HTTP yanitinda hata firlatir ama token'i mesaja yazmaz", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    try {
      await runApifyActorSync("gizli-token", "actor1", {});
      throw new Error("hata beklenirdi");
    } catch (e) {
      expect((e as Error).message).toMatch(/HTTP 401/);
      expect((e as Error).message).not.toContain("gizli-token");
    }
  });
});
