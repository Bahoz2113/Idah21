import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import { hashPassword, validatePasswordStrength } from "@cezeri/auth";
import { getEmailProvider } from "@cezeri/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  if (await authService.isRateLimited(`pwreset-verify:${ip}`, 15, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz bekleyin." }, { status: 429 });
  }

  const { email, code, newPassword } = await req.json().catch(() => ({}));
  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: "Tüm alanlar gerekli" }, { status: 400 });
  }
  const strengthError = validatePasswordStrength(newPassword);
  if (strengthError) return NextResponse.json({ error: strengthError }, { status: 400 });

  const normalized = String(email).trim().toLowerCase();
  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, "firstName" FROM users WHERE lower(email) = ${normalized} LIMIT 1
  `;
  const user = rows[0];
  if (!user) return NextResponse.json({ error: "Kod hatalı veya süresi dolmuş" }, { status: 400 });

  const result = await authService.verifyCode("password_reset_codes", user.id, String(code));
  if (result !== "ok") {
    const msg = result === "too_many_attempts" ? "Çok fazla hatalı deneme. Sıfırlamayı yeniden başlatın." : "Kod hatalı veya süresi dolmuş.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const hash = await hashPassword(newPassword);
  await prisma.$executeRaw`
    UPDATE users SET "passwordHash" = ${hash}, "failedLoginAttempts" = 0, "lockedUntil" = NULL WHERE id = ${user.id}
  `;
  // Tüm mevcut oturumları iptal et (şifre değişince her yerden çıkış)
  await prisma.$executeRaw`UPDATE login_sessions SET "revokedAt" = now() WHERE "userId" = ${user.id} AND "revokedAt" IS NULL`;

  await authService.logAudit({ userId: user.id, action: "PASSWORD_RESET", entity: "user", entityId: user.id });
  await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "PASSWORD_RESET_COMPLETED", ip });
  await getEmailProvider().sendSecurityAlert(
    normalized,
    "Şifreniz başarıyla değiştirildi. Bu işlemi siz yapmadıysanız hemen yöneticinizle iletişime geçin.",
    user.firstName ?? undefined
  );

  return NextResponse.json({ ok: true });
}
