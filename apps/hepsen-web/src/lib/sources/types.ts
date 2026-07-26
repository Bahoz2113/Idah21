/** Tum kaynak adaptorlerinin ortak ciktisi — collected_items'a yazilmadan once. */
export interface NormalizedItem {
  externalId: string | null;
  platform: string;
  title: string | null;
  content: string;
  url: string;
  author: string | null;
  authorHandle: string | null;
  publishedAt: string; // ISO 8601
  rawPayload?: unknown;
}

export interface SourceRow {
  id: string;
  name: string;
  type: "rss" | "google_news" | "official_site" | "apify_query";
  url_or_query: string;
  reliability_level: number;
  is_active: boolean;
  category: string | null;
}
