import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/compte", "/vendeur", "/checkout", "/api/"],
      },
    ],
    sitemap: "https://spectrumforus.com/sitemap.xml",
  };
}
