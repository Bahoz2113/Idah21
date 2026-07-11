import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import { verifyPassword } from "@cezeri/auth";
import { getEmailProvider } from "@cezeri/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GENERIC_ERROR = "E-posta veya şifre hatalı";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  const ua = req.headers.get("user-agent") ?? "";

  // Genel IP bazlı fren (script'lerle toplu deneme engeli)
  if (await authService.isRateLimited(`login:${ip}`, 30, 5 * 60_000)) {
    return NextResponse.json({ error: "Çok fazla giriş denemesi. Lütfen birkaç dakika sonra tekrar deneyin." }, { status: 429 });
  }

  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
  }
  const normalized = String(email).trim().toLowerCase();

  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, "organizationId", role, status, "passwordHash", "firstName"
    FROM users WHERE lower(email) = ${normalized} LIMIT 1
  `;
  const user = rows[0];

  if (!user) {
    await authService.logSecurityEvent({ email: normalized, eventType: "LOGIN_FAILED", ip, ua, meta: { reason: "no_such_user" } });
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  const lock = await authService.isAccountLocked(user.id);
  if (lock.locked) {
    const mins = Math.ceil((lock.until!.getTime() - Date.now()) / 60000);
    return NextResponse.json({ error: `Çok fazla başarısız deneme. ${mins} dakika sonra tekrar deneyin.` }, { status: 423 });
  }

  if (user.status === "PENDING" || !user.passwordHash) {
    return NextResponse.json({ error: "Hesabınız için ilk kurulumu tamamlamanız gerekiyor.", needsSetup: true }, { status: 403 });
  }
  if (user.status === "PASSIVE") {
    return NextResponse.json({ error: "Hesabınız pasif durumda. Yöneticinizle iletişime geçin." }, { status: 403 });
  }

  const passwordOk = await verifyPassword(password, user.passwordHash);
  if (!passwordOk) {
    const lockedNow = await authService.registerFailedAttempt(user.id);
    await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "LOGIN_FAILED", ip, ua, meta: { reason: "bad_password" } });
    if (lockedNow) {
      await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "ACCOUNT_LOCKED", ip, ua });
      await getEmailProvider().sendSecurityAlert(
        normalized,
        "Hesabınız çok sayıda başarısız giriş denemesi nedeniyle 15 dakika süreyle geçici olarak kilitlendi. Bu işlemi siz yapmadıysanız yöneticinizle iletişime geçin.",
        user.firstName ?? undefined
      );
      return NextResponse.json({ error: "Çok fazla başarısız deneme. Hesabınız 15 dakika kilitlendi." }, { status: 423 });
    }
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  // Şifre doğru — e-posta doğrulama kodu gönder (her girişte zorunlu)
  const code = await authService.createCode("email_login_codes", user.id, { ip, ua });
  await getEmailProvider().sendLoginVerificationCode(normalized, code, user.firstName ?? undefined);
  await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "LOGIN_PASSWORD_OK", ip, ua });

  return NextResponse.json({ ok: true, step: "verify", email: normalized });
}
