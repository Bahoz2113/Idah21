import { createHash } from "node:crypto";
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => {
  Object.assign(process.env, {
    NEXT_PUBLIC_APP_URL: "http://localhost:3010",
    NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
    SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    DATABASE_URL: "postgres://user:pass@host:5432/db",
    X_CLIENT_ID: "test-client-id",
    X_CLIENT_SECRET: "test-client-secret",
    X_REDIRECT_URI: "http://localhost:3010/api/auth/x/callback",
    TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 3).toString("base64"),
    ANTHROPIC_API_KEY: "sk-ant-test",
  });
});

function base64url(input: Buffer): string {
  return input.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

describe("X OAuth PKCE", () => {
  it("code verifier RFC 7636 uzunluk araliginda (43-128)", async () => {
    const { generateCodeVerifier } = await import("@/lib/x/oauth");
    const v = generateCodeVerifier();
    expect(v.length).toBeGreaterThanOrEqual(43);
    expect(v.length).toBeLessThanOrEqual(128);
    expect(v).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("codeChallengeS256, verifier'in SHA-256 base64url'ini uretir", async () => {
    const { codeChallengeS256 } = await import("@/lib/x/oauth");
    const verifier = "test-verifier-deterministic-value";
    const expected = base64url(createHash("sha256").update(verifier).digest());
    expect(codeChallengeS256(verifier)).toBe(expected);
  });

  it("buildAuthorizeUrl dogru scope, state ve challenge parametrelerini icerir", async () => {
    const { buildAuthorizeUrl, X_SCOPES, X_AUTHORIZE_URL } = await import("@/lib/x/oauth");
    const url = new URL(buildAuthorizeUrl({ state: "abc123", codeChallenge: "chal123" }));
    expect(url.origin + url.pathname).toBe(X_AUTHORIZE_URL);
    expect(url.searchParams.get("client_id")).toBe("test-client-id");
    expect(url.searchParams.get("redirect_uri")).toBe("http://localhost:3010/api/auth/x/callback");
    expect(url.searchParams.get("scope")).toBe(X_SCOPES.join(" "));
    expect(url.searchParams.get("state")).toBe("abc123");
    expect(url.searchParams.get("code_challenge")).toBe("chal123");
    expect(url.searchParams.get("code_challenge_method")).toBe("S256");
    expect(url.searchParams.get("response_type")).toBe("code");
  });

  it("iki farkli generateState() cagrisi ayni degeri uretmez", async () => {
    const { generateState } = await import("@/lib/x/oauth");
    expect(generateState()).not.toBe(generateState());
  });
});
