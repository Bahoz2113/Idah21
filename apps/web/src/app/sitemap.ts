import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Tek sayfalık deneyim olduğu için sitemap yalnızca kanonik kökü bildirir.
 * Bölüm çapaları (#hangarlar vb.) ayrı URL değildir; sitemap'e eklenmeleri
 * yinelenen içerik sinyali üretir, bu yüzden kasıtlı olarak dışarıda bırakıldı.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
