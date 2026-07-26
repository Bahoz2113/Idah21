import { describe, it, expect, beforeAll } from "vitest";

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
    TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 9).toString("base64"),
    ANTHROPIC_API_KEY: "sk-ant-test",
  });
});

describe("token-cipher", () => {
  it("encrypt/decrypt round-trip orijinal metni geri verir", async () => {
    const { encryptToken, decryptToken } = await import("@/lib/crypto/token-cipher");
    const plaintext = "gizli-x-access-token-1234567890";
    const encrypted = encryptToken(plaintext);
    expect(decryptToken(encrypted)).toBe(plaintext);
  });

  it("sifreli veri duz metni icermez", async () => {
    const { encryptToken } = await import("@/lib/crypto/token-cipher");
    const plaintext = "cok-gizli-token";
    const encrypted = encryptToken(plaintext);
    expect(encrypted.toString("utf8")).not.toContain(plaintext);
  });

  it("bozulmus veri (auth tag uyumsuz) decryptte hata firlatir", async () => {
    const { encryptToken, decryptToken } = await import("@/lib/crypto/token-cipher");
    const encrypted = encryptToken("token");
    encrypted[encrypted.length - 1] ^= 0xff; // ciphertext'i boz
    expect(() => decryptToken(encrypted)).toThrow();
  });

  it("bufferToPgBytea/pgByteaToBuffer round-trip calisir", async () => {
    const { encryptToken, decryptToken, bufferToPgBytea, pgByteaToBuffer } = await import(
      "@/lib/crypto/token-cipher"
    );
    const plaintext = "round-trip-token";
    const encrypted = encryptToken(plaintext);
    const pgFormat = bufferToPgBytea(encrypted);
    expect(pgFormat.startsWith("\\x")).toBe(true);
    const decoded = pgByteaToBuffer(pgFormat);
    expect(decryptToken(decoded)).toBe(plaintext);
  });
});
