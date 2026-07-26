import "server-only";
import { z } from "zod";

/**
 * Sunucu-taraflı env dogrulamasi. Eksik/hatali degiskende build/start aninda
 * acik hatayla durur (fail-fast) — master prompt md. 23 "Server-only secrets
 * ve environment validation kullan".
 */
const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  DATABASE_URL: z.string().min(1),

  X_CLIENT_ID: z.string().min(1),
  X_CLIENT_SECRET: z.string().min(1),
  X_REDIRECT_URI: z.string().url(),

  TOKEN_ENCRYPTION_KEY: z
    .string()
    .refine((v) => Buffer.from(v, "base64").length === 32, {
      message: "TOKEN_ENCRYPTION_KEY base64 ile kodlanmis 32 byte olmali",
    }),

  APIFY_API_TOKEN: z.string().optional().default(""),
  APIFY_X_ACTOR_ID: z.string().optional().default(""),

  LLM_PROVIDER: z.enum(["anthropic", "openai", "gemini"]).default("anthropic"),
  OPENAI_API_KEY: z.string().optional().default(""),
  ANTHROPIC_API_KEY: z.string().min(1),
  GEMINI_API_KEY: z.string().optional().default(""),

  SENTRY_DSN: z.string().optional().default(""),
  CRON_SECRET: z.string().optional().default(""),

  MONTHLY_BUDGET_USD: z.coerce.number().positive().default(20),
  APP_TIMEZONE: z.string().default("Europe/Istanbul"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

/** Server-only. İlk çağrıda dogrular ve önbelleğe alir; hatada acik mesajla firlatir. */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`Ortam degiskenleri gecersiz: ${issues}`);
  }
  cached = parsed.data;
  return cached;
}
