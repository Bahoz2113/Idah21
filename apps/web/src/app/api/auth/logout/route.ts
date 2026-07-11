import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@cezeri/database";
import { ACCESS_COOKIE, REFRESH_COOKIE, hashOpaqueToken } from "@cezeri/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const rawRefresh = req.cookies.get(REFRESH_COOKIE)?.value;
  if (rawRefresh) {
    const hash = hashOpaqueToken(rawRefresh);
    await prisma.$executeRaw`UPDATE login_sessions SET "revokedAt" = now() WHERE "refreshTokenHash" = ${hash}`;
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ACCESS_COOKIE);
  res.cookies.delete(REFRESH_COOKIE);
  return res;
}
