import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { randomInt, randomBytes, createHash } from "crypto";

// ───────────────────────── 6 haneli doğrulama kodları ─────────────────────────

/** Kriptografik olarak güvenli 6 haneli sayısal kod (100000-999999) */
export function generate6DigitCode(): string {
  return String(randomInt(100000, 1000000));
}

/** Kodlar plain text saklanmaz — sha256 hash'lenir (hızlı karşılaştırma yeterli, brute force zaten rate-limit ile engellenir) */
export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function verifyCodeHash(code: string, hash: string): boolean {
  return hashCode(code) === hash;
}

// ───────────────────────── Opak token'lar (refresh token) ─────────────────────────

export function generateOpaqueToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashOpaqueToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ───────────────────────── Erişim JWT'si (bizim kendi imzamız) ─────────────────────────

export interface AccessTokenPayload extends JWTPayload {
  sub: string;           // userId
  organizationId: string;
  role: string;
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_JWT_SECRET tanımlı değil veya çok kısa (min 32 karakter gerekli)");
  }
  return new TextEncoder().encode(secret);
}

const ACCESS_TOKEN_TTL = "8h";

export async function signAccessToken(payload: Omit<AccessTokenPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

// ───────────────────────── Supabase-uyumlu JWT (yalnızca Realtime yetkilendirmesi için) ─────────────────────────
// Uygulamanın kendi oturumu artık Supabase Auth'a bağlı değil, ama mevcut RLS politikaları
// (auth_user_org/auth_user_role, bkz. Postgres fonksiyonları) auth.jwt() okuyor. Realtime
// abonelikleri çalışmaya devam etsin diye, girişte bu politikaların beklediği şekle uygun
// bir JWT üretip yalnızca realtime.setAuth() için tarayıcıya veriyoruz — tRPC/API çağrıları
// bunu KULLANMAZ, onlar kendi AUTH_JWT_SECRET imzalı token'ımızı kullanır.
export async function signRealtimeCompatToken(user: {
  id: string; organizationId: string; role: string; email: string;
}): Promise<string | null> {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) return null; // yapılandırılmamışsa realtime sessizce devre dışı kalır, hata vermez
  return new SignJWT({
    sub: user.id,
    role: "authenticated",
    email: user.email,
    user_metadata: { role: user.role, organizationId: user.organizationId },
    aud: "authenticated",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(new TextEncoder().encode(secret));
}
