import { XMLParser } from "fast-xml-parser";
import type { NormalizedItem } from "./types";

const parser = new XMLParser({ ignoreAttributes: false, trimValues: true });

function toArray<T>(v: T | T[] | undefined | null): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function stripHtml(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** RSS 2.0 ve basit Atom feed'lerini ayristirir. Aginn cagirmaz — saf fonksiyon. */
export function parseRssFeed(xml: string, sourceName: string): NormalizedItem[] {
  let parsed: unknown;
  try {
    parsed = parser.parse(xml);
  } catch {
    return [];
  }
  const root = parsed as {
    rss?: { channel?: { item?: unknown } };
    feed?: { entry?: unknown };
  };

  const channelItems = toArray(root.rss?.channel?.item) as Record<string, unknown>[];
  if (channelItems.length > 0) {
    return channelItems
      .map((item) => rssItemToNormalized(item, sourceName))
      .filter((x): x is NormalizedItem => x !== null);
  }

  const atomEntries = toArray(root.feed?.entry) as Record<string, unknown>[];
  if (atomEntries.length > 0) {
    return atomEntries
      .map((entry) => atomEntryToNormalized(entry, sourceName))
      .filter((x): x is NormalizedItem => x !== null);
  }

  return [];
}

function textOf(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object" && "#text" in (v as Record<string, unknown>)) {
    return String((v as Record<string, unknown>)["#text"]);
  }
  return null;
}

function rssItemToNormalized(item: Record<string, unknown>, sourceName: string): NormalizedItem | null {
  const link = textOf(item.link);
  const title = textOf(item.title);
  const descriptionRaw = textOf(item.description) ?? textOf(item["content:encoded"]);
  const content = descriptionRaw ? stripHtml(descriptionRaw) : "";
  // Master prompt: baslik, icerik, URL, tarih ve kaynak olmadan islenmez —
  // baslik icerigin yerine gecemez, ikisi de ayri ayri zorunlu.
  if (!link || !title || !content) return null;

  const pubDateRaw = textOf(item.pubDate) ?? textOf(item["dc:date"]);
  const parsedDate = pubDateRaw ? new Date(pubDateRaw) : null;
  const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();

  return {
    externalId: link,
    platform: sourceName,
    title,
    content,
    url: link,
    author: textOf(item.author) ?? textOf(item["dc:creator"]),
    authorHandle: null,
    publishedAt,
    rawPayload: item,
  };
}

function atomEntryToNormalized(entry: Record<string, unknown>, sourceName: string): NormalizedItem | null {
  const linkField = entry.link as Record<string, unknown> | Record<string, unknown>[] | undefined;
  const linkObj = Array.isArray(linkField) ? linkField[0] : linkField;
  const link = (linkObj?.["@_href"] as string | undefined) ?? textOf(entry.link);
  const title = textOf(entry.title);
  const summaryRaw = textOf(entry.summary) ?? textOf(entry.content);
  const content = summaryRaw ? stripHtml(summaryRaw) : "";
  if (!link || !title || !content) return null;

  const dateRaw = textOf(entry.updated) ?? textOf(entry.published);
  const parsedDate = dateRaw ? new Date(dateRaw) : null;
  const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date().toISOString();

  const authorField = entry.author as Record<string, unknown> | undefined;

  return {
    externalId: textOf(entry.id) ?? link,
    platform: sourceName,
    title,
    content,
    url: link,
    author: authorField ? textOf(authorField.name) : null,
    authorHandle: null,
    publishedAt,
    rawPayload: entry,
  };
}

export async function fetchRssSource(source: { url_or_query: string; name: string }): Promise<NormalizedItem[]> {
  const res = await fetch(source.url_or_query, { headers: { "User-Agent": "HEPSENBatmanBot/1.0" } });
  if (!res.ok) throw new Error(`RSS kaynağı alınamadı (${source.name}): HTTP ${res.status}`);
  const xml = await res.text();
  return parseRssFeed(xml, source.name);
}
