import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";
import { getEmailProvider } from "@cezeri/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  const { email } = await req.json().catch(() => ({}));
  if (!email) return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
  const normalized = String(email).trim().toLowerCase();

  // Kullanıcı bazlı sıkı sınır (3/saat) + IP bazlı genel fren
  if (await authService.isRateLimited(`pwreset:${normalized}`, 3, 60 * 60_000)) {
    return NextResponse.json({ ok: true }); // sessizce yut — enumeration'a karşı aynı yanıt
  }
  if (await authService.isRateLimited(`pwreset-ip:${ip}`, 20, 60 * 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen daha sonra tekrar deneyin." }, { status: 429 });
  }

  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, "firstName" FROM users WHERE lower(email) = ${normalized} AND status = 'ACTIVE' AND "passwordHash" IS NOT NULL LIMIT 1
  `;
  const user = rows[0];

  // Kullanıcı var/yok fark etmeksizin aynı yanıt (e-posta numaralandırma saldırısını önler)
  if (user) {
    const code = await authService.createCode("password_reset_codes", user.id);
    await getEmailProvider().sendPasswordResetCode(normalized, code, user.firstName ?? undefined);
    await authService.logSecurityEvent({ userId: user.id, email: normalized, eventType: "PASSWORD_RESET_REQUESTED", ip });
  }

  return NextResponse.json({ ok: true });
}
