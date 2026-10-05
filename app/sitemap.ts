import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const LAST_MODIFIED = new Date("2026-10-05");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: LAST_MODIFIED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/termini`, lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/crediti`, lastModified: LAST_MODIFIED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
