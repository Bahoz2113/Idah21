import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import {
  ACCESS_COOKIE, REFRESH_COOKIE,
  accessCookieOptions, refreshCookieOptions,
  hashOpaqueToken, generateOpaqueToken, signAccessToken, signRealtimeCompatToken,
} from "@cezeri/auth";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawRefresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!rawRefresh) return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });

  const hash = hashOpaqueToken(rawRefresh);
  const rows = await prisma.$queryRaw<any[]>`
    SELECT ls.id AS "sessionId", ls."userId", u."organizationId", u.role, u.email, u.status
    FROM login_sessions ls
    JOIN users u ON u.id = ls."userId"
    WHERE ls."refreshTokenHash" = ${hash} AND ls."revokedAt" IS NULL AND ls."expiresAt" > now()
    LIMIT 1
  `;
  const row = rows[0];

  if (!row || row.status !== "ACTIVE") {
    const res = NextResponse.json({ error: "Oturum geçersiz, tekrar giriş yapın" }, { status: 401 });
    res.cookies.delete(ACCESS_COOKIE);
    res.cookies.delete(REFRESH_COOKIE);
    return res;
  }

  // Rotasyon: eski refresh token iptal edilir, yenisi verilir (tekrar oynatma saldırısına karşı)
  await prisma.$executeRaw`UPDATE login_sessions SET "revokedAt" = now() WHERE id = ${row.sessionId}`;

  const newRefresh = generateOpaqueToken();
  const newRefreshHash = hashOpaqueToken(newRefresh);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.$executeRaw`
    INSERT INTO login_sessions (id, "userId", "refreshTokenHash", "expiresAt", "lastUsedAt")
    VALUES (${randomUUID()}, ${row.userId}, ${newRefreshHash}, ${expiresAt}, now())
  `;

  const accessToken = await signAccessToken({
    sub: row.userId, organizationId: row.organizationId, role: row.role, email: row.email,
  });
  const realtimeToken = await signRealtimeCompatToken({
    id: row.userId, organizationId: row.organizationId, role: row.role, email: row.email,
  });

  const res = NextResponse.json({ ok: true, realtimeToken });
  res.cookies.set(ACCESS_COOKIE, accessToken, accessCookieOptions());
  res.cookies.set(REFRESH_COOKIE, newRefresh, refreshCookieOptions());
  return res;
}
