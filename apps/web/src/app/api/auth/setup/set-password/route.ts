import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import { hashPassword, validatePasswordStrength } from "@cezeri/auth";
import { getEmailProvider } from "@cezeri/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  if (await authService.isRateLimited(`setup-pw:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz bekleyin." }, { status: 429 });
  }

  const { email, password } = await req.json().catch(() => ({}));
  if (!email || !password) {
    return NextResponse.json({ error: "E-posta ve şifre gerekli" }, { status: 400 });
  }
  const strengthError = validatePasswordStrength(password);
  if (strengthError) return NextResponse.json({ error: strengthError }, { status: 400 });

  const normalized = String(email).trim().toLowerCase();
  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, "firstName", status, "passwordHash" FROM users WHERE lower(email) = ${normalized} LIMIT 1
  `;
  const user = rows[0];
  if (!user || user.passwordHash || user.status === "PASSIVE") {
    return NextResponse.json({ error: "Kurulum başlatılamadı. Bilgilerinizi kontrol edin." }, { status: 400 });
  }

  const hash = await hashPassword(password);
  await prisma.$executeRaw`UPDATE users SET "passwordHash" = ${hash} WHERE id = ${user.id}`;

  const code = await authService.createCode("email_verification_codes", user.id);
  await getEmailProvider().sendEmailVerificationCode(normalized, code, user.firstName ?? undefined);
  await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "SETUP_PASSWORD_SET", ip, ua: req.headers.get("user-agent") });

  return NextResponse.json({ ok: true });
}
