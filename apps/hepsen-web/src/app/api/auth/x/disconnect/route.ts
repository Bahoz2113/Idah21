import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase, getServiceRoleClient } from "@/lib/supabase/server";
import { decryptToken, pgByteaToBuffer } from "@/lib/crypto/token-cipher";
import { revokeToken } from "@/lib/x/oauth";
import { writeAuditLog } from "@/lib/audit/log";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const service = getServiceRoleClient();
  const { data: account } = await service
    .from("x_accounts")
    .select("id, access_token_encrypted")
    .eq("user_id", user.id)
    .is("revoked_at", null)
    .maybeSingle<{ id: string; access_token_encrypted: string }>();

  if (account) {
    try {
      const accessToken = decryptToken(pgByteaToBuffer(account.access_token_encrypted));
      await revokeToken(accessToken);
    } catch {
      // Best-effort revoke; X tarafinda basarisiz olsa da yerel baglantiyi kaldirmaya devam et.
    }

    await service.from("x_accounts").update({ revoked_at: new Date().toISOString() }).eq("id", account.id);
    await writeAuditLog({ userId: user.id, action: "x_disconnect", entityType: "x_accounts", entityId: account.id });
  }

  return NextResponse.redirect(new URL("/settings", request.url));
}
