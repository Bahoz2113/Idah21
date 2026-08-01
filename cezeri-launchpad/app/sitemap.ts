import type { MetadataRoute } from "next";
import { SITE_URL, allRoutes } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return allRoutes().map((route) => ({
    url: `${SITE_URL}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "/" ? "monthly" : "yearly",
    priority: route === "/" ? 1 : route.startsWith("/basinda-biz/") ? 0.8 : 0.7,
  }));
}
