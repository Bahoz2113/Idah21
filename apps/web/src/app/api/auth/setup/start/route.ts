import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { authService } from "@cezeri/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const ip = authService.getClientIp(req.headers);
  if (await authService.isRateLimited(`setup-start:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen biraz bekleyin." }, { status: 429 });
  }

  const { email } = await req.json().catch(() => ({}));
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "E-posta gerekli" }, { status: 400 });
  }
  const normalized = email.trim().toLowerCase();

  const rows = await prisma.$queryRaw<any[]>`
    SELECT id, status, "passwordHash" FROM users WHERE lower(email) = ${normalized} LIMIT 1
  `;
  const user = rows[0];

  if (!user) {
    return NextResponse.json({ error: "Bu e-posta adresi sistemde kayıtlı değil. Yöneticinizle iletişime geçin." }, { status: 404 });
  }
  if (user.passwordHash) {
    return NextResponse.json({ error: "Bu hesap için kurulum zaten tamamlanmış. Giriş yapabilirsiniz." }, { status: 409 });
  }
  if (user.status === "PASSIVE") {
    return NextResponse.json({ error: "Hesabınız pasif durumda. Yöneticinizle iletişime geçin." }, { status: 403 });
  }

  return NextResponse.json({ ok: true, email: normalized });
}
