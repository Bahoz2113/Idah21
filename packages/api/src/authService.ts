import { prisma } from "@cezeri/database";
import {
  generate6DigitCode, hashCode, verifyCodeHash,
  generateOpaqueToken, hashOpaqueToken,
  signAccessToken, signRealtimeCompatToken,
  deviceFingerprint,
} from "@cezeri/auth";
import { randomUUID } from "crypto";

const CODE_TTL_MS       = 10 * 60 * 1000; // 10 dakika
const MAX_CODE_ATTEMPTS = 5;
const LOCKOUT_MS        = 15 * 60 * 1000; // 15 dakika
const MAX_LOGIN_FAILS   = 5;

// ───────────────────────── Rate limiting (DB tabanlı, Redis gerektirmez) ─────────────────────────

/** bucketKey içinde son windowMs süresinde `limit`'ten fazla istek varsa true döner (rate-limit tetiklendi) */
export async function isRateLimited(bucketKey: string, limit: number, windowMs: number): Promise<boolean> {
  await prisma.$executeRaw`INSERT INTO rate_limit_hits ("bucketKey") VALUES (${bucketKey})`;
  // Fırsatçı temizlik: 24 saatten eski kayıtları sil (tablo sonsuz büyümesin)
  await prisma.$executeRaw`DELETE FROM rate_limit_hits WHERE "createdAt" < now() - interval '24 hours'`;
  const rows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT count(*) AS count FROM rate_limit_hits
    WHERE "bucketKey" = ${bucketKey} AND "createdAt" > now() - (${windowMs}::text || ' milliseconds')::interval
  `;
  return Number(rows[0]?.count ?? 0) > limit;
}

// ───────────────────────── Kilit / başarısız deneme yönetimi ─────────────────────────

export async function isAccountLocked(userId: string): Promise<{ locked: boolean; until?: Date }> {
  const rows = await prisma.$queryRaw<{ lockedUntil: Date | null }[]>`
    SELECT "lockedUntil" FROM users WHERE id = ${userId}
  `;
  const until = rows[0]?.lockedUntil ?? null;
  if (until && new Date(until).getTime() > Date.now()) return { locked: true, until: new Date(until) };
  return { locked: false };
}

/** Başarısız deneme sayar; 5'e ulaşınca 15 dk kilitler. Kilitlenirse true döner. */
export async function registerFailedAttempt(userId: string): Promise<boolean> {
  const rows = await prisma.$queryRaw<{ failedLoginAttempts: number }[]>`
    UPDATE users SET "failedLoginAttempts" = "failedLoginAttempts" + 1
    WHERE id = ${userId}
    RETURNING "failedLoginAttempts"
  `;
  const attempts = rows[0]?.failedLoginAttempts ?? 0;
  if (attempts >= MAX_LOGIN_FAILS) {
    const until = new Date(Date.now() + LOCKOUT_MS);
    await prisma.$executeRaw`UPDATE users SET "lockedUntil" = ${until} WHERE id = ${userId}`;
    return true;
  }
  return false;
}

export async function resetFailedAttempts(userId: string): Promise<void> {
  await prisma.$executeRaw`
    UPDATE users SET "failedLoginAttempts" = 0, "lockedUntil" = NULL WHERE id = ${userId}
  `;
}

// ───────────────────────── 6 haneli kod üret/gönder/doğrula ─────────────────────────

type CodeTable = "email_verification_codes" | "email_login_codes" | "password_reset_codes";

export async function createCode(table: CodeTable, userId: string, extra?: { ip?: string; ua?: string }) {
  const code = generate6DigitCode();
  const codeHash = hashCode(code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  const id = randomUUID();
  if (table === "email_login_codes") {
    await prisma.$executeRaw`
      INSERT INTO email_login_codes (id, "userId", "codeHash", "expiresAt", "ipAddress", "userAgent")
      VALUES (${id}, ${userId}, ${codeHash}, ${expiresAt}, ${extra?.ip ?? null}, ${extra?.ua ?? null})
    `;
  } else if (table === "email_verification_codes") {
    await prisma.$executeRaw`
      INSERT INTO email_verification_codes (id, "userId", "codeHash", "expiresAt")
      VALUES (${id}, ${userId}, ${codeHash}, ${expiresAt})
    `;
  } else {
    await prisma.$executeRaw`
      INSERT INTO password_reset_codes (id, "userId", "codeHash", "expiresAt")
      VALUES (${id}, ${userId}, ${codeHash}, ${expiresAt})
    `;
  }
  return code;
}

/** Kod doğrular. Sonuç: "ok" | "invalid" | "expired" | "too_many_attempts" */
export async function verifyCode(table: CodeTable, userId: string, code: string): Promise<"ok" | "invalid" | "expired" | "too_many_attempts"> {
  const rows = await prisma.$queryRawUnsafe<any[]>(
    `SELECT id, "codeHash", "expiresAt", attempts FROM ${table}
     WHERE "userId" = $1 AND "consumedAt" IS NULL ORDER BY "createdAt" DESC LIMIT 1`,
    userId
  );
  const row = rows[0];
  if (!row) return "invalid";
  if (row.attempts >= MAX_CODE_ATTEMPTS) return "too_many_attempts";
  if (new Date(row.expiresAt).getTime() < Date.now()) return "expired";

  if (!verifyCodeHash(code, row.codeHash)) {
    await prisma.$executeRawUnsafe(`UPDATE ${table} SET attempts = attempts + 1 WHERE id = $1`, row.id);
    return "invalid";
  }
  await prisma.$executeRawUnsafe(`UPDATE ${table} SET "consumedAt" = now() WHERE id = $1`, row.id);
  return "ok";
}

// ───────────────────────── Güvenlik / audit log ─────────────────────────

export async function logSecurityEvent(opts: {
  userId?: string | null; email?: string | null; eventType: string;
  ip?: string | null; ua?: string | null; meta?: Record<string, unknown>;
}) {
  await prisma.$executeRaw`
    INSERT INTO security_events (id, "userId", email, "eventType", "ipAddress", "userAgent", meta)
    VALUES (${randomUUID()}, ${opts.userId ?? null}, ${opts.email ?? null}, ${opts.eventType},
            ${opts.ip ?? null}, ${opts.ua ?? null}, ${JSON.stringify(opts.meta ?? {})}::jsonb)
  `;
}

export async function logAudit(opts: {
  userId: string; action: string; entity: string; entityId?: string; meta?: Record<string, unknown>;
}) {
  await prisma.$executeRaw`
    INSERT INTO audit_logs (id, "userId", action, entity, "entityId", meta)
    VALUES (${randomUUID()}, ${opts.userId}, ${opts.action}, ${opts.entity}, ${opts.entityId ?? null},
            ${JSON.stringify(opts.meta ?? {})}::jsonb)
  `;
}

// ───────────────────────── Cihaz güveni ("yeni cihaz" tespiti) ─────────────────────────

export async function checkAndTrustDevice(userId: string, userAgent: string, deviceId: string): Promise<{ isNewDevice: boolean }> {
  const fp = deviceFingerprint(userAgent, deviceId);
  const rows = await prisma.$queryRaw<any[]>`
    SELECT id FROM trusted_devices WHERE "userId" = ${userId} AND "deviceFingerprint" = ${fp} LIMIT 1
  `;
  if (rows.length > 0) {
    await prisma.$executeRaw`UPDATE trusted_devices SET "lastSeenAt" = now() WHERE id = ${rows[0].id}`;
    return { isNewDevice: false };
  }
  await prisma.$executeRaw`
    INSERT INTO trusted_devices (id, "userId", "deviceFingerprint", label)
    VALUES (${randomUUID()}, ${userId}, ${fp}, ${userAgent.slice(0, 120)})
  `;
  return { isNewDevice: true };
}

// ───────────────────────── Oturum oluşturma (login başarılı olduğunda) ─────────────────────────

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  refreshExpiresAt: Date;
  realtimeToken: string | null;
}

export async function issueSession(user: {
  id: string; organizationId: string; role: string; email: string;
}, deviceFingerprintValue: string, ip?: string, ua?: string): Promise<IssuedSession> {
  const accessToken = await signAccessToken({
    sub: user.id, organizationId: user.organizationId, role: user.role, email: user.email,
  });
  const realtimeToken = await signRealtimeCompatToken(user);

  const refreshToken = generateOpaqueToken();
  const refreshTokenHash = hashOpaqueToken(refreshToken);
  const refreshExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.$executeRaw`
    INSERT INTO login_sessions (id, "userId", "refreshTokenHash", "deviceFingerprint", "userAgent", "ipAddress", "expiresAt")
    VALUES (${randomUUID()}, ${user.id}, ${refreshTokenHash}, ${deviceFingerprintValue}, ${ua ?? null}, ${ip ?? null}, ${refreshExpiresAt})
  `;
  await prisma.$executeRaw`UPDATE users SET "lastLoginAt" = now() WHERE id = ${user.id}`;

  return { accessToken, refreshToken, refreshExpiresAt, realtimeToken };
}

export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? headers.get("x-real-ip")
      ?? "unknown";
}
