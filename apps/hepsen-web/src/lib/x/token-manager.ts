import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { decryptToken, encryptToken, bufferToPgBytea, pgByteaToBuffer } from "@/lib/crypto/token-cipher";
import { refreshAccessToken } from "@/lib/x/oauth";

/** Token'i bu sureden erken bitecekse yenile (agin/isteklerin gecikmesine karsi pay). */
const REFRESH_MARGIN_MS = 5 * 60_000;

interface XAccountTokenRow {
  id: string;
  access_token_encrypted: string;
  refresh_token_encrypted: string;
  expires_at: string;
}

/**
 * Kullanicinin aktif X hesabi icin gecerli bir access token dondurur;
 * gerekirse otomatik yeniler ve yeni sifreli token'lari DB'ye yazar.
 * Duz metin token bu fonksiyon disina (log, hata mesaji) asla cikmaz.
 */
export async function ensureFreshAccessToken(
  supabase: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data: account } = await supabase
    .from("x_accounts")
    .select("id, access_token_encrypted, refresh_token_encrypted, expires_at")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("connected_at", { ascending: false })
    .limit(1)
    .maybeSingle<XAccountTokenRow>();

  if (!account) return null;

  const expiresAt = new Date(account.expires_at).getTime();
  if (expiresAt - Date.now() > REFRESH_MARGIN_MS) {
    return decryptToken(pgByteaToBuffer(account.access_token_encrypted));
  }

  const refreshToken = decryptToken(pgByteaToBuffer(account.refresh_token_encrypted));
  const refreshed = await refreshAccessToken(refreshToken);

  await supabase
    .from("x_accounts")
    .update({
      access_token_encrypted: bufferToPgBytea(encryptToken(refreshed.access_token)),
      refresh_token_encrypted: bufferToPgBytea(
        encryptToken(refreshed.refresh_token ?? refreshToken),
      ),
      expires_at: new Date(Date.now() + refreshed.expires_in * 1000).toISOString(),
    })
    .eq("id", account.id);

  return refreshed.access_token;
}
