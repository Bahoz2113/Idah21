import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, verifyAccessToken, signRealtimeCompatToken } from "@cezeri/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mevcut oturumdan (ceos_at cookie) anlık bir Supabase-uyumlu JWT üretir.
 * Bu token yalnızca Realtime (postgres_changes) yetkilendirmesi içindir —
 * tRPC/API çağrıları için KULLANILMAZ, onlar httpOnly cookie'yi kullanır.
 * SUPABASE_JWT_SECRET tanımlı değilse token=null döner (realtime sessizce pasif kalır).
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return NextResponse.json({ token: null }, { status: 401 });

  const payload = await verifyAccessToken(token);
  if (!payload?.sub) return NextResponse.json({ token: null }, { status: 401 });

  const realtimeToken = await signRealtimeCompatToken({
    id: payload.sub as string,
    organizationId: payload.organizationId as string,
    role: payload.role as string,
    email: payload.email as string,
  });
  return NextResponse.json({ token: realtimeToken });
}
