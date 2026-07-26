import type { NormalizedItem } from "./types";

const MAX_CONTENT_CHARS = 8000;

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

/**
 * GENEL resmi-site adaptoru: sayfanin tum HTML'ini duz metne cevirip TEK bir
 * NormalizedItem uretir. Site-ozel CSS-selector'lu bir scraper YAZILMADI —
 * bu ortamda HTML yapisi canli dogrulanamadi (bkz. docs/adr/0005). Kaynak
 * aktiflestirilmeden once gercek sayfaya karsi test edilmeli.
 */
export function parseOfficialSitePage(html: string, sourceName: string, url: string): NormalizedItem | null {
  const withoutNoise = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");

  const titleMatch = withoutNoise.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeEntities(titleMatch[1]).trim() || null : null;

  const text = decodeEntities(withoutNoise.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  // Master prompt: baslik ve icerik ayri ayri zorunlu, biri digerinin yerine gecemez.
  if (!title || !text) return null;

  return {
    externalId: url,
    platform: sourceName,
    title,
    content: text.slice(0, MAX_CONTENT_CHARS),
    url,
    author: null,
    authorHandle: null,
    // Sayfada guvenilir bir yayin tarihi alani yok (genel adapter); toplama
    // ani kullanilir. Dedup content_hash'e dayandigi icin bu sorun yaratmaz.
    publishedAt: new Date().toISOString(),
  };
}

export async function fetchOfficialSite(source: { url_or_query: string; name: string }): Promise<NormalizedItem[]> {
  const res = await fetch(source.url_or_query, { headers: { "User-Agent": "HEPSENBatmanBot/1.0" } });
  if (!res.ok) throw new Error(`Resmi site alınamadı (${source.name}): HTTP ${res.status}`);
  const html = await res.text();
  const item = parseOfficialSitePage(html, source.name, source.url_or_query);
  return item ? [item] : [];
}
