import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import { encryptToken, bufferToPgBytea } from "@/lib/crypto/token-cipher";

beforeAll(() => {
  Object.assign(process.env, {
    NEXT_PUBLIC_APP_URL: "http://localhost:3010",
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    DATABASE_URL: "postgres://user:pass@host:5432/db",
    X_CLIENT_ID: "client-id",
    X_CLIENT_SECRET: "client-secret",
    X_REDIRECT_URI: "http://localhost:3010/api/auth/x/callback",
    TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 5).toString("base64"),
    ANTHROPIC_API_KEY: "sk-ant-test",
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function makeSelectChain(row: unknown) {
  const chain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    is: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: row, error: null }),
  };
  return chain;
}

describe("ensureFreshAccessToken", () => {
  it("token suresi henuz dolmamissa mevcut token'i deşifreleyip doner, fetch cagirmaz", async () => {
    const { ensureFreshAccessToken } = await import("@/lib/x/token-manager");
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);

    const encrypted = bufferToPgBytea(encryptToken("gecerli-access-token"));
    const selectChain = makeSelectChain({
      id: "acc-1",
      access_token_encrypted: encrypted,
      refresh_token_encrypted: encrypted,
      expires_at: new Date(Date.now() + 3_600_000).toISOString(), // 1 saat sonra
    });
    const updateEq = vi.fn();
    const supabase = { from: vi.fn().mockReturnValue({ ...selectChain, update: vi.fn().mockReturnValue({ eq: updateEq }) }) };

    const token = await ensureFreshAccessToken(supabase as never, "user-1");
    expect(token).toBe("gecerli-access-token");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("token suresi dolmuşsa/yakinsa yeniler ve DB'yi gunceller", async () => {
    const { ensureFreshAccessToken } = await import("@/lib/x/token-manager");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          token_type: "bearer",
          expires_in: 7200,
          access_token: "yeni-access-token",
          scope: "tweet.read tweet.write",
          refresh_token: "yeni-refresh-token",
        }),
      }),
    );

    const encrypted = bufferToPgBytea(encryptToken("eski-refresh-token"));
    const selectChain = makeSelectChain({
      id: "acc-1",
      access_token_encrypted: encrypted,
      refresh_token_encrypted: encrypted,
      expires_at: new Date(Date.now() - 1000).toISOString(), // suresi dolmus
    });
    const updateEq = vi.fn().mockResolvedValue({ data: null, error: null });
    const supabase = { from: vi.fn().mockReturnValue({ ...selectChain, update: vi.fn().mockReturnValue({ eq: updateEq }) }) };

    const token = await ensureFreshAccessToken(supabase as never, "user-1");
    expect(token).toBe("yeni-access-token");
    expect(updateEq).toHaveBeenCalledWith("id", "acc-1");
  });

  it("baglı X hesabi yoksa null doner", async () => {
    const { ensureFreshAccessToken } = await import("@/lib/x/token-manager");
    const selectChain = makeSelectChain(null);
    const supabase = { from: vi.fn().mockReturnValue(selectChain) };
    const token = await ensureFreshAccessToken(supabase as never, "user-1");
    expect(token).toBeNull();
  });
});
