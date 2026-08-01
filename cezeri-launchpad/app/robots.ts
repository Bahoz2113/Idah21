import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI CRAWLER POLİTİKASI
 *
 * Bu botlara açık izin verilmesi GEO'nun ön koşuludur.
 * ⚠️ `Google-Extended` engellenirse site Gemini cevaplarında HİÇ görünmez —
 * çoğu sitenin farkında olmadan yaptığı hata budur.
 */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "/api/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
