import { NextResponse, type NextRequest } from "next/server";
import { exchangeCodeForToken } from "@/lib/x/oauth";
import { fetchXUserInfo } from "@/lib/x/client";
import { encryptToken, bufferToPgBytea } from "@/lib/crypto/token-cipher";
import { getServerSupabase, getServiceRoleClient } from "@/lib/supabase/server";
import { writeAuditLog } from "@/lib/audit/log";
import { X_SCOPES } from "@/lib/x/oauth";

export const dynamic = "force-dynamic";

const STATE_COOKIE = "x_oauth_state";
const VERIFIER_COOKIE = "x_oauth_verifier";

export async function GET(request: NextRequest) {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const settingsUrl = new URL("/settings", request.url);
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const returnedState = params.get("state");
  const cookieState = request.cookies.get(STATE_COOKIE)?.value;
  const verifier = request.cookies.get(VERIFIER_COOKIE)?.value;

  const clearCookies = (res: NextResponse) => {
    res.cookies.delete(STATE_COOKIE);
    res.cookies.delete(VERIFIER_COOKIE);
    return res;
  };

  if (!code || !returnedState || !cookieState || returnedState !== cookieState || !verifier) {
    await writeAuditLog({ userId: user.id, action: "x_connect_failed", metadata: { reason: "state_mismatch" } });
    settingsUrl.searchParams.set("error", "x_connect_failed");
    return clearCookies(NextResponse.redirect(settingsUrl));
  }

  try {
    const token = await exchangeCodeForToken({ code, codeVerifier: verifier });
    if (!token.refresh_token) {
      throw new Error("offline.access scope verilmedi, refresh token alinamadi");
    }
    const xUser = await fetchXUserInfo(token.access_token);

    const service = getServiceRoleClient();
    const expiresAt = new Date(Date.now() + token.expires_in * 1000).toISOString();
    const { error: upsertError } = await service.from("x_accounts").upsert(
      {
        user_id: user.id,
        x_user_id: xUser.id,
        username: xUser.username,
        access_token_encrypted: bufferToPgBytea(encryptToken(token.access_token)),
        refresh_token_encrypted: bufferToPgBytea(encryptToken(token.refresh_token)),
        expires_at: expiresAt,
        scopes: [...X_SCOPES],
        revoked_at: null,
      },
      { onConflict: "user_id,x_user_id" },
    );
    if (upsertError) throw new Error(upsertError.message);

    await writeAuditLog({
      userId: user.id,
      action: "x_connect_succeeded",
      entityType: "x_accounts",
      metadata: { username: xUser.username },
    });
    return clearCookies(NextResponse.redirect(settingsUrl));
  } catch {
    // Hata mesaji/govdesi loglanmiyor — token veya kod sizintisi riski.
    await writeAuditLog({ userId: user.id, action: "x_connect_failed", metadata: { reason: "token_exchange_error" } });
    settingsUrl.searchParams.set("error", "x_connect_failed");
    return clearCookies(NextResponse.redirect(settingsUrl));
  }
}
