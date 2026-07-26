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
