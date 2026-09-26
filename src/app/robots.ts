import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: [
      "https://buzzscoop.news/sitemap.xml",
      "https://buzzscoop.news/news-sitemap.xml",
    ],
    host: "https://buzzscoop.news",
  };
}