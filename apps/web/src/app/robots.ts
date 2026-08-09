import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Arama ve üretken motor erişim politikası.
 *
 * GEO notu: ChatGPT, Claude ve Perplexity gibi üretken motorlar kendi
 * user-agent'larıyla tarar. Varsayılan "*" kuralı onları kapsasa da, bu
 * botlar için AÇIK izin satırı yazmak ayrıca gerekir: Google-Extended gibi
 * bazıları, açık izin yoksa içeriği yanıt üretiminde kullanmaz. Kurum
 * otoritesinin AI cevaplarında görünmesi bu izinlere bağlıdır.
 *
 * Panel rotaları (admin/teacher/parent/student) ve API dizini kimlik
 * doğrulaması gerektirir; indekslenmeleri hem gereksiz hem sızıntı riskidir.
 */
const PRIVATE_PATHS = [
  // Alternatif tasarım denemesi: içeriği `/` ile birebir aynıdır.
  // Taranmasına izin vermek yinelenen içerik sinyali üretir ve asıl
  // sayfanın sıralamasını zayıflatır. Sayfa `noindex` de taşır; burada
  // ayrıca engellenmesi taramanın hiç başlamaması içindir.
  "/alternatif",
  "/api/",
  "/admin/",
  "/teacher/",
  "/parent/",
  "/student/",
  "/login",
  "/register",
  "/ilk-kurulum",
  "/sifremi-unuttum",
  "/davet/",
  "/quiz/",
];

const GENERATIVE_AGENTS = [
  "GPTBot",           // OpenAI — ChatGPT tarama
  "OAI-SearchBot",    // OpenAI arama indeksi
  "ChatGPT-User",     // ChatGPT canlı erişim
  "ClaudeBot",        // Anthropic
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",    // Perplexity
  "Perplexity-User",
  "Google-Extended",  // Google AI Overviews / Gemini temellendirme
  "Applebot-Extended",
  "cohere-ai",
  "Meta-ExternalAgent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      ...GENERATIVE_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: PRIVATE_PATHS,
      })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
