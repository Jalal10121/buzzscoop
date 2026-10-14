/**
 * Manual Trends Tracker
 * Stores trending topics + links to Google Trends
 */

import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const TRENDS_FILE = "trends-history.json";

export interface TrendEntry {
  id: string;
  topic: string;
  keyword: string;
  category: string;
  source: "google-trends" | "tudum" | "manual";
  country: string;
  addedAt: string;
  status: "new" | "used" | "skipped";
  articleSlug?: string;
}

function readTrends(): TrendEntry[] {
  try {
    const p = path.join(DATA_DIR, TRENDS_FILE);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeTrends(data: TrendEntry[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, TRENDS_FILE), JSON.stringify(data, null, 2));
}

export const trends = {
  all: (): TrendEntry[] => readTrends(),

  add: (entry: Omit<TrendEntry, "id" | "addedAt" | "status">) => {
    const all = readTrends();
    const newEntry: TrendEntry = {
      ...entry,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
      status: "new",
    };
    all.unshift(newEntry);
    writeTrends(all.slice(0, 500));
    return newEntry;
  },

  markUsed: (id: string, articleSlug: string) => {
    const all = readTrends();
    const t = all.find((x) => x.id === id);
    if (t) {
      t.status = "used";
      t.articleSlug = articleSlug;
    }
    writeTrends(all);
  },

  markSkipped: (id: string) => {
    const all = readTrends();
    const t = all.find((x) => x.id === id);
    if (t) t.status = "skipped";
    writeTrends(all);
  },

  remove: (id: string) => {
    writeTrends(readTrends().filter((t) => t.id !== id));
  },

  clear: () => writeTrends([]),

  stats: () => {
    const all = readTrends();
    return {
      total: all.length,
      new: all.filter((t) => t.status === "new").length,
      used: all.filter((t) => t.status === "used").length,
      skipped: all.filter((t) => t.status === "skipped").length,
    };
  },
};

// Direct links for manual research
export const TRENDS_LINKS = {
  trendingNow: "https://trends.google.com/trending?geo=US&hours=24",
  entertainment: "https://trends.google.com/trending?geo=US&hours=24&category=3", // Entertainment category
  netflixSearch: "https://trends.google.com/trends/explore?geo=US&q=netflix",
  tudum: "https://www.netflix.com/tudum",
  whatsOnNetflix: "https://www.whats-on-netflix.com/",
};