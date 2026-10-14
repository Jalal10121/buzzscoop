import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const secretPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "panel-secret";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/admin/",
          "/" + secretPath,
          "/" + secretPath + "/",
        ],
      },
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