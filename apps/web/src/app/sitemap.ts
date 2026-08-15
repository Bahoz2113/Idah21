import type { MetadataRoute } from "next";
import { localeMeta, localePath, locales } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo/site";

/**
 * SİTE HARİTASI.
 *
 * Tek sayfalık bir deneyim ama DÖRT adresi var: her dilin kendi sayfası
 * ayrı bir URL'dir ve ayrı dizine girer. Bölüm çapaları (`#egitimler`)
 * ayrı URL değildir; sitemap'e eklenmeleri yinelenen içerik sinyali
 * üretir, bu yüzden kasıtlı olarak dışarıda.
 *
 * Her kayıt kendi `alternates.languages` listesini taşır. Bu, sayfadaki
 * `hreflang` etiketlerinin sitemap tarafındaki karşılığıdır; Google iki
 * kaynağın birbirini doğrulamasını bekler. Yalnızca birinde bildirilen
 * dil ilişkisi zayıf sinyaldir.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeMeta[l].tag] = `${SITE_URL}${localePath(l)}`;

  return locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale)}`,
    lastModified,
    changeFrequency: "weekly",
    // Türkçe kanonik dil ve yerel arama hedefimiz Batman; öncelik onda.
    priority: locale === "tr" ? 1 : 0.8,
    alternates: { languages },
  }));
}
