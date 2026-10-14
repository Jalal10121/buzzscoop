/**
 * Netflix Tudum Scraper
 * Fetches new content only (no direct copy)
 */

export interface ScrapedItem {
  id: string;
  title: string;
  description: string;
  category: string;
  sourceUrl: string;
  scrapedAt: string;
  imageUrl?: string;
}

const TUDUM_URL = "https://www.netflix.com/tudum";

export async function scrapeTudum(): Promise<ScrapedItem[]> {
  try {
    const res = await fetch(TUDUM_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BuzzScoopBot/1.0; +https://buzzscoop.news)",
        "Accept": "text/html",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("Tudum fetch failed:", res.status);
      return [];
    }

    const html = await res.text();

    // Extract article-like titles and descriptions
    const items: ScrapedItem[] = [];

    // Pattern 1: Headline-like text
    const titleRegex = /<h[23][^>]*>([^<]{20,120})<\/h[23]>/gi;
    const descRegex = /<p[^>]*>([^<]{40,200})<\/p>/gi;

    const titles: string[] = [];
    let match;
    while ((match = titleRegex.exec(html)) !== null) {
      const title = match[1].trim();
      if (title && !titles.includes(title)) {
        titles.push(title);
      }
    }

    const descriptions: string[] = [];
    while ((match = descRegex.exec(html)) !== null) {
      const desc = match[1].trim();
      if (desc && !descriptions.includes(desc)) {
        descriptions.push(desc);
      }
    }

    // Combine titles with descriptions
    titles.slice(0, 10).forEach((title, i) => {
      items.push({
        id: `tudum-${Date.now()}-${i}`,
        title,
        description: descriptions[i] || title,
        category: categorize(title),
        sourceUrl: TUDUM_URL,
        scrapedAt: new Date().toISOString(),
      });
    });

    return items;
  } catch (err) {
    console.error("Scraper error:", err);
    return [];
  }
}

function categorize(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("netflix")) return "Netflix";
  if (t.includes("marvel") || t.includes("superhero")) return "Marvel";
  if (t.includes("music") || t.includes("album") || t.includes("song")) return "Music";
  if (t.includes("movie") || t.includes("film")) return "Hollywood";
  if (t.includes("series") || t.includes("season") || t.includes("show")) return "TV";
  if (t.includes("award") || t.includes("emmy") || t.includes("oscar")) return "Awards";
  return "Netflix";
}

export function isDuplicate(title: string, existingTitles: string[]): boolean {
  const normalized = title.toLowerCase().replace(/[^\w\s]/g, "").trim();
  return existingTitles.some((t) => {
    const existing = t.toLowerCase().replace(/[^\w\s]/g, "").trim();
    // Check if 70% of words match
    const words1 = new Set(normalized.split(/\s+/));
    const words2 = new Set(existing.split(/\s+/));
    const intersection = [...words1].filter((w) => words2.has(w));
    const similarity = intersection.length / Math.max(words1.size, words2.size);
    return similarity > 0.7;
  });
}