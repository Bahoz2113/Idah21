import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import {
  ACCESS_COOKIE, REFRESH_COOKIE, DEVICE_COOKIE,
  accessCookieOptions, refreshCookieOptions, deviceCookieOptions,
  deviceFingerprint, generateOpaqueToken,
} from "@cezeri/auth";
import { getEmailProvider } from "@cezeri/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  const ua = req.headers.get("user-agent") ?? "";

  if (await authService.isRateLimited(`login-verify:${ip}`, 30, 5 * 60_000)) {
    return NextResponse.json({ error: "Çok fazla deneme. Lütfen birkaç dakika sonra tekrar deneyin." }, { status: 429 });
  }

  const { email, code } = await req.json().catch(() => ({}));
  if (!email || !code) return NextResponse.json({ error: "E-posta ve kod gerekli" }, { status: 400 });

  const normalized = String(email).trim().toLowerCase();
  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, "organizationId", role, status, "firstName", "lastName" FROM users
    WHERE lower(email) = ${normalized} AND status = 'ACTIVE' LIMIT 1
  `;
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "Kod hatalı veya süresi dolmuş" }, { status: 400 });

  const lock = await authService.isAccountLocked(user.id);
  if (lock.locked) {
    const mins = Math.ceil((lock.until!.getTime() - Date.now()) / 60000);
    return NextResponse.json({ error: `Çok fazla başarısız deneme. ${mins} dakika sonra tekrar deneyin.` }, { status: 423 });
  }

  const result = await authService.verifyCode("email_login_codes", user.id, String(code));
  if (result !== "ok") {
    const lockedNow = await authService.registerFailedAttempt(user.id);
    await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "LOGIN_FAILED", ip, ua, meta: { reason: "bad_otp" } });
    if (lockedNow) {
      await getEmailProvider().sendSecurityAlert(
        normalized,
        "Hesabınız çok sayıda başarısız giriş denemesi nedeniyle 15 dakika süreyle geçici olarak kilitlendi.",
        user.firstName ?? undefined
      );
      return NextResponse.json({ error: "Çok fazla başarısız deneme. Hesabınız 15 dakika kilitlendi." }, { status: 423 });
    }
    const msg = result === "too_many_attempts" ? "Çok fazla hatalı deneme. Yeniden giriş yapın." : "Kod hatalı veya süresi dolmuş.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  await authService.resetFailedAttempts(user.id);

  // Cihaz kontrolü — yeni cihazsa güvenlik uyarısı gönder
  let deviceId = req.cookies.get(DEVICE_COOKIE)?.value;
  const isNewDeviceCookie = !deviceId;
  if (!deviceId) deviceId = generateOpaqueToken();
  const { isNewDevice } = await authService.checkAndTrustDevice(user.id, ua, deviceId);
  if (isNewDevice) {
    await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "NEW_DEVICE", ip, ua });
    await getEmailProvider().sendSecurityAlert(
      normalized,
      `Hesabınıza yeni bir cihazdan giriş yapıldı.\nTarih: ${new Date().toLocaleString("tr-TR")}\nIP: ${ip}\nCihaz: ${ua}\n\nBu işlemi siz yapmadıysanız hemen şifrenizi değiştirin ve yöneticinize bildirin.`,
      user.firstName ?? undefined
    );
  }

  const fp = deviceFingerprint(ua, deviceId);
  const session = await authService.issueSession(
    { id: user.id, organizationId: user.organizationId, role: user.role, email: normalized },
    fp, ip, ua
  );
  await authService.logAudit({ userId: user.id, action: "LOGIN_SUCCESS", entity: "user", entityId: user.id, meta: { ip, newDevice: isNewDevice } });
  await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "LOGIN_SUCCESS", ip, ua });

  const res = NextResponse.json({
    ok: true, role: user.role, firstName: user.firstName, lastName: user.lastName,
    realtimeToken: session.realtimeToken,
  });
  res.cookies.set(ACCESS_COOKIE, session.accessToken, accessCookieOptions());
  res.cookies.set(REFRESH_COOKIE, session.refreshToken, refreshCookieOptions());
  if (isNewDeviceCookie) res.cookies.set(DEVICE_COOKIE, deviceId, deviceCookieOptions());
  return res;
}
