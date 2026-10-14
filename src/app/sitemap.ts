import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/mdx";

const BASE = "https://buzzscoop.news";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })),
  ];
}