import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/siteConfig";

export default function robots(): MetadataRoute.Robots {
  const base = `https://${siteConfig.domain}`;
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}

