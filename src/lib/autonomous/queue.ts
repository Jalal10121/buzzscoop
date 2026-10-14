import fs from "fs";
import path from "path";
import type { DraftArticle } from "./draft-generator";
import { isDuplicate } from "./scraper";

const DATA_DIR = path.join(process.cwd(), "data");
const QUEUE_FILE = "auto-queue.json";
const PUBLISHED_FILE = "articles.json";

function readQueue(): DraftArticle[] {
  try {
    const p = path.join(DATA_DIR, QUEUE_FILE);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeQueue(data: DraftArticle[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, QUEUE_FILE), JSON.stringify(data, null, 2));
}

function getPublishedSlugs(): string[] {
  try {
    const p = path.join(DATA_DIR, PUBLISHED_FILE);
    if (!fs.existsSync(p)) return [];
    const articles = JSON.parse(fs.readFileSync(p, "utf-8"));
    return Array.isArray(articles) ? articles.map((a: { slug: string }) => a.slug) : [];
  } catch { return []; }
}

export const queue = {
  all: (): DraftArticle[] => readQueue(),

  pending: (): DraftArticle[] =>
    readQueue().filter((d) => d.status === "pending"),

  add(draft: DraftArticle): boolean {
    const existing = readQueue();
    const publishedSlugs = getPublishedSlugs();

    // Duplicate check against both queue and published
    const existingTitles = existing.map((d) => d.title).concat(publishedSlugs);
    if (isDuplicate(draft.title, existingTitles)) {
      console.log(`Duplicate skipped: ${draft.title}`);
      return false;
    }

    existing.unshift(draft);
    writeQueue(existing.slice(0, 100)); // Keep last 100
    return true;
  },

  approve(id: string): DraftArticle | null {
    const drafts = readQueue();
    const draft = drafts.find((d) => d.id === id);
    if (!draft) return null;

    // Add to published articles
    const articles = JSON.parse(
      fs.existsSync(path.join(DATA_DIR, PUBLISHED_FILE))
        ? fs.readFileSync(path.join(DATA_DIR, PUBLISHED_FILE), "utf-8")
        : "[]"
    );

    articles.unshift({
      id: Date.now().toString(),
      title: draft.title,
      slug: draft.slug,
      description: draft.description,
      content: draft.content,
      image: draft.image,
      category: draft.category,
      author: draft.author,
      date: draft.date,
      featured: false,
      tags: [draft.category.toLowerCase()],
      status: "published",
      createdAt: draft.createdAt,
      updatedAt: new Date().toISOString(),
    });

    fs.writeFileSync(
      path.join(DATA_DIR, PUBLISHED_FILE),
      JSON.stringify(articles, null, 2)
    );

    // Mark as approved
    draft.status = "approved";
    writeQueue(drafts);

    return draft;
  },

  reject(id: string): void {
    const drafts = readQueue();
    const draft = drafts.find((d) => d.id === id);
    if (draft) draft.status = "rejected";
    writeQueue(drafts);
  },

  clear(): void {
    writeQueue([]);
  },

  stats() {
    const all = readQueue();
    return {
      total: all.length,
      pending: all.filter((d) => d.status === "pending").length,
      approved: all.filter((d) => d.status === "approved").length,
      rejected: all.filter((d) => d.status === "rejected").length,
    };
  },
};