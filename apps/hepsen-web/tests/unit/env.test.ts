import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const VALID_ENV = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3010",
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
  DATABASE_URL: "postgres://user:pass@host:5432/db",
  X_CLIENT_ID: "client-id",
  X_CLIENT_SECRET: "client-secret",
  X_REDIRECT_URI: "http://localhost:3010/api/auth/x/callback",
  TOKEN_ENCRYPTION_KEY: Buffer.alloc(32, 7).toString("base64"),
  ANTHROPIC_API_KEY: "sk-ant-test",
};

const ORIGINAL_ENV = { ...process.env };

describe("getEnv", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
  });
  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  it("gecerli env ile basariyla parse eder ve varsayilanlari uygular", async () => {
    process.env = { ...process.env, ...VALID_ENV };
    const { getEnv } = await import("@/lib/env");
    const env = getEnv();
    expect(env.MONTHLY_BUDGET_USD).toBe(20);
    expect(env.APP_TIMEZONE).toBe("Europe/Istanbul");
    expect(env.LLM_PROVIDER).toBe("anthropic");
  });

  it("eksik zorunlu degiskende acik hatayla firlar", async () => {
    process.env = { ...process.env, ...VALID_ENV };
    delete process.env.ANTHROPIC_API_KEY;
    const { getEnv } = await import("@/lib/env");
    expect(() => getEnv()).toThrow(/Ortam degiskenleri gecersiz/);
  });

  it("TOKEN_ENCRYPTION_KEY 32 byte degilse hata verir", async () => {
    process.env = { ...process.env, ...VALID_ENV, TOKEN_ENCRYPTION_KEY: Buffer.alloc(16).toString("base64") };
    const { getEnv } = await import("@/lib/env");
    expect(() => getEnv()).toThrow();
  });
});
