import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `https://${siteConfig.domain}`;
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}${siteConfig.links.whitepaper}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}${siteConfig.links.community}`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}${siteConfig.links.dapp}`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}

