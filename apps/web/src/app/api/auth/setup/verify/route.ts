import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import {
  ACCESS_COOKIE, REFRESH_COOKIE, DEVICE_COOKIE,
  accessCookieOptions, refreshCookieOptions, deviceCookieOptions,
  deviceFingerprint, generateOpaqueToken,
} from "@cezeri/auth";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  const ua = req.headers.get("user-agent") ?? "";

  if (await authService.isRateLimited(`setup-verify:${ip}`, 15, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz bekleyin." }, { status: 429 });
  }

  const { email, code } = await req.json().catch(() => ({}));
  if (!email || !code) return NextResponse.json({ error: "E-posta ve kod gerekli" }, { status: 400 });

  const normalized = String(email).trim().toLowerCase();
  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, "organizationId", role, "firstName" FROM users WHERE lower(email) = ${normalized} LIMIT 1
  `;
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "Kod hatalı veya süresi dolmuş" }, { status: 400 });

  const result = await authService.verifyCode("email_verification_codes", user.id, String(code));
  if (result !== "ok") {
    const msg = result === "too_many_attempts"
      ? "Çok fazla hatalı deneme. Yeniden kurulum başlatın."
      : "Kod hatalı veya süresi dolmuş.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  await prisma.$executeRaw`
    UPDATE users SET status = 'ACTIVE'::"UserStatus", "emailVerifiedAt" = now() WHERE id = ${user.id}
  `;
  await authService.logAudit({ userId: user.id, action: "USER_ACTIVATED", entity: "user", entityId: user.id });

  // Kurulum sonrası otomatik giriş (spec adım 7-8)
  let deviceId = req.cookies.get(DEVICE_COOKIE)?.value;
  const isNewDeviceCookie = !deviceId;
  if (!deviceId) deviceId = generateOpaqueToken();
  const fp = deviceFingerprint(ua, deviceId);
  await authService.checkAndTrustDevice(user.id, ua, deviceId);

  const session = await authService.issueSession(
    { id: user.id, organizationId: user.organizationId, role: user.role, email: normalized },
    fp, ip, ua
  );
  await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "LOGIN_SUCCESS", ip, ua, meta: { via: "initial_setup" } });

  const res = NextResponse.json({
    ok: true, role: user.role, firstName: user.firstName, realtimeToken: session.realtimeToken,
  });
  res.cookies.set(ACCESS_COOKIE, session.accessToken, accessCookieOptions());
  res.cookies.set(REFRESH_COOKIE, session.refreshToken, refreshCookieOptions());
  if (isNewDeviceCookie) res.cookies.set(DEVICE_COOKIE, deviceId, deviceCookieOptions());
  return res;
}
