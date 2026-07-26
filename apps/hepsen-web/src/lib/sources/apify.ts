import type { NormalizedItem } from "./types";

export interface ApifyRawItem {
  id?: string;
  url?: string;
  text?: string;
  fullText?: string;
  authorUsername?: string;
  createdAt?: string;
  [key: string]: unknown;
}

/**
 * "Run Actor synchronously and get dataset items" ucu — ayri run+poll+fetch
 * adimlarina gerek birakmaz. bkz. docs/adr/0003-apify-actor-secimi.md.
 */
export async function runApifyActorSync(
  token: string,
  actorId: string,
  input: Record<string, unknown>,
): Promise<ApifyRawItem[]> {
  const url = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    // Token asla hata mesajina yazilmaz.
    throw new Error(`Apify actor çalıştırılamadı: HTTP ${res.status}`);
  }
  return (await res.json()) as ApifyRawItem[];
}

export function normalizeApifyItem(raw: ApifyRawItem): NormalizedItem | null {
  const text = raw.fullText ?? raw.text;
  const url = raw.url;
  if (!text || !url) return null;

  const parsedDate = raw.createdAt ? new Date(raw.createdAt) : null;
  const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();

  return {
    externalId: raw.id ? String(raw.id) : String(url),
    platform: "x",
    title: null,
    content: String(text),
    url: String(url),
    author: null,
    authorHandle: raw.authorUsername ? String(raw.authorUsername) : null,
    publishedAt,
    rawPayload: raw,
  };
}

/**
 * APIFY_API_TOKEN veya APIFY_X_ACTOR_ID bos ise SESSIZCE bos dizi doner —
 * hata firlatmaz. Gercek token gelene kadar collect job'ini bozmaz.
 */
export async function collectFromApify(
  source: { url_or_query: string; name: string },
  env: { APIFY_API_TOKEN: string; APIFY_X_ACTOR_ID: string },
): Promise<NormalizedItem[]> {
  if (!env.APIFY_API_TOKEN || !env.APIFY_X_ACTOR_ID) return [];
  const items = await runApifyActorSync(env.APIFY_API_TOKEN, env.APIFY_X_ACTOR_ID, {
    searchTerms: [source.url_or_query],
  });
  return items.map(normalizeApifyItem).filter((x): x is NormalizedItem => x !== null);
}
