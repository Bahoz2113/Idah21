import type { SourceRow, NormalizedItem } from "./types";
import { fetchRssSource } from "./rss";
import { fetchOfficialSite } from "./official-site";
import { collectFromApify } from "./apify";

export * from "./types";
export * from "./rss";
export * from "./official-site";
export * from "./apify";

export interface ApifyEnv {
  APIFY_API_TOKEN: string;
  APIFY_X_ACTOR_ID: string;
}

/** Kaynak tipine gore dogru adaptore yonlendirir. */
export async function collectFromSource(source: SourceRow, env: ApifyEnv): Promise<NormalizedItem[]> {
  if (!source.is_active) return [];
  switch (source.type) {
    case "rss":
    case "google_news":
      return fetchRssSource(source);
    case "official_site":
      return fetchOfficialSite(source);
    case "apify_query":
      return collectFromApify(source, env);
    default:
      return [];
  }
}
