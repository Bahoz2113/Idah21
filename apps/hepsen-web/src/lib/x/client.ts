import "server-only";

/**
 * Token asla bu dosya disina duz metin olarak cikmaz; caginan yer (callback
 * route) sifreleyip DB'ye yazar, bu dosya yalnizca bellekte kullanir.
 */
export interface XUserInfo {
  id: string;
  username: string;
}

export async function fetchXUserInfo(accessToken: string): Promise<XUserInfo> {
  const res = await fetch("https://api.x.com/2/users/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`X kullanici bilgisi alinamadi: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data: { id: string; username: string } };
  return { id: json.data.id, username: json.data.username };
}

/** Onaylanmis ve zamani gelen taslagi gercekten X'e gonderir — bkz. lib/jobs/publish-due-drafts.ts. */
export async function postTweet(accessToken: string, text: string): Promise<{ id: string }> {
  const res = await fetch("https://api.x.com/2/tweets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    // Token asla hata mesajina yazilmaz; govde de (paylasim metni disinda) loglanmaz.
    throw new Error(`X gönderi paylaşımı başarısız: HTTP ${res.status}`);
  }
  const json = (await res.json()) as { data: { id: string } };
  return { id: json.data.id };
}
