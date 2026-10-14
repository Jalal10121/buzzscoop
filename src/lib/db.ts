import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function readJSON<T>(file: string, fallback: T): T {
  try {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return fallback; }
}

function writeJSON(file: string, data: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), "utf-8");
}

export interface DBArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  featured: boolean;
  tags: string[];
  status?: "draft" | "published" | "scheduled";
  scheduledFor?: string;
  revisions?: { content: string; updatedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface DBAuthor {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
}

export interface DBSettings {
  siteName: string;
  siteDescription: string;
  logo: string;
  twitter: string;
  instagram: string;
  youtube: string;
  facebook: string;
  adsenseId: string;
}

export const db = {
  articles: {
    all: (): DBArticle[] => readJSON("articles.json", []),
    allPublished: (): DBArticle[] => db.articles.all().filter((a) => !a.status || a.status === "published"),
    get: (id: string) => db.articles.all().find((a) => a.id === id),
    getBySlug: (slug: string) => db.articles.all().find((a) => a.slug === slug),
    create: (article: Omit<DBArticle, "id" | "createdAt" | "updatedAt">) => {
      const all = db.articles.all();
      const newArticle: DBArticle = {
        ...article,
        id: Date.now().toString(),
        status: article.status || "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      all.unshift(newArticle);
      writeJSON("articles.json", all);
      return newArticle;
    },
    update: (id: string, updates: Partial<DBArticle>) => {
      const all = db.articles.all();
      const idx = all.findIndex((a) => a.id === id);
      if (idx === -1) return null;

      const old = all[idx];
      const revisions = old.revisions || [];
      revisions.push({ content: old.content, updatedAt: new Date().toISOString() });

      all[idx] = {
        ...old,
        ...updates,
        revisions: revisions.slice(-10),
        updatedAt: new Date().toISOString(),
      };
      writeJSON("articles.json", all);
      return all[idx];
    },
    delete: (id: string) => {
      const all = db.articles.all().filter((a) => a.id !== id);
      writeJSON("articles.json", all);
      return true;
    },
    restoreRevision: (id: string, revisionIndex: number) => {
      const article = db.articles.get(id);
      if (!article || !article.revisions) return null;
      const rev = article.revisions[revisionIndex];
      if (!rev) return null;
      return db.articles.update(id, { content: rev.content });
    },
  },
  categories: {
    all: (): string[] => readJSON("categories.json", []),
    save: (list: string[]) => writeJSON("categories.json", list),
  },
  authors: {
    all: (): DBAuthor[] => readJSON("authors.json", []),
    save: (list: DBAuthor[]) => writeJSON("authors.json", list),
  },
  settings: {
    get: (): DBSettings => readJSON("settings.json", {} as DBSettings),
    save: (s: Partial<DBSettings>) => {
      const current = db.settings.get();
      writeJSON("settings.json", { ...current, ...s });
      return { ...current, ...s };
    },
  },
  users: {
    all: () => readJSON<{ id: string; username: string; password: string; role: string; name?: string }[]>("users.json", []),
  },
  analytics: {
    track: (slug: string, referrer?: string) => {
      const views = readJSON<{ slug: string; timestamp: string; referrer?: string }[]>("analytics.json", []);
      views.push({ slug, timestamp: new Date().toISOString(), referrer });
      writeJSON("analytics.json", views.slice(-10000));
    },
  },
};