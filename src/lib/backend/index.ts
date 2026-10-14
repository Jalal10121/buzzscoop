/**
 * Unified Backend Adapter
 * Uses GitHub API in production, local files in dev
 */

import fs from "fs";
import path from "path";
import * as gh from "./github";

const DATA_DIR = path.join(process.cwd(), "data");
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const USE_GITHUB = gh.isGitHubConfigured() && IS_PRODUCTION;

interface Article {
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
  status?: string;
  revisions?: { content: string; updatedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export const backend = {
  async readArticles(): Promise<Article[]> {
    if (USE_GITHUB) return gh.readJSON<Article[]>("data/articles.json", []);
    try {
      const p = path.join(DATA_DIR, "articles.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async writeArticles(articles: Article[], message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/articles.json", articles, message);
    fs.writeFileSync(path.join(DATA_DIR, "articles.json"), JSON.stringify(articles, null, 2));
  },

  async readCategories(): Promise<string[]> {
    if (USE_GITHUB) return gh.readJSON<string[]>("data/categories.json", []);
    try {
      const p = path.join(DATA_DIR, "categories.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async writeCategories(categories: string[], message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/categories.json", categories, message);
    fs.writeFileSync(path.join(DATA_DIR, "categories.json"), JSON.stringify(categories, null, 2));
  },

  async readAuthors<T = unknown>(): Promise<T[]> {
    if (USE_GITHUB) return gh.readJSON<T[]>("data/authors.json", []);
    try {
      const p = path.join(DATA_DIR, "authors.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async writeAuthors<T>(authors: T[], message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/authors.json", authors, message);
    fs.writeFileSync(path.join(DATA_DIR, "authors.json"), JSON.stringify(authors, null, 2));
  },

  async readSettings<T = unknown>(fallback: T): Promise<T> {
    if (USE_GITHUB) return gh.readJSON<T>("data/settings.json", fallback);
    try {
      const p = path.join(DATA_DIR, "settings.json");
      if (!fs.existsSync(p)) return fallback;
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return fallback; }
  },

  async writeSettings<T>(settings: T, message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/settings.json", settings, message);
    fs.writeFileSync(path.join(DATA_DIR, "settings.json"), JSON.stringify(settings, null, 2));
  },

  async readUsers<T = unknown>(): Promise<T[]> {
    if (USE_GITHUB) return gh.readJSON<T[]>("data/users.json", []);
    try {
      const p = path.join(DATA_DIR, "users.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async readComments<T = unknown>(): Promise<T[]> {
    if (USE_GITHUB) return gh.readJSON<T[]>("data/comments.json", []);
    try {
      const p = path.join(DATA_DIR, "comments.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async writeComments<T>(comments: T[], message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/comments.json", comments, message);
    fs.writeFileSync(path.join(DATA_DIR, "comments.json"), JSON.stringify(comments, null, 2));
  },

  async readSubscribers<T = unknown>(): Promise<T[]> {
    if (USE_GITHUB) return gh.readJSON<T[]>("data/subscribers.json", []);
    try {
      const p = path.join(DATA_DIR, "subscribers.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async writeSubscribers<T>(subs: T[], message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/subscribers.json", subs, message);
    fs.writeFileSync(path.join(DATA_DIR, "subscribers.json"), JSON.stringify(subs, null, 2));
  },

  async readAnalytics<T = unknown>(): Promise<T[]> {
    if (USE_GITHUB) return gh.readJSON<T[]>("data/analytics.json", []);
    try {
      const p = path.join(DATA_DIR, "analytics.json");
      if (!fs.existsSync(p)) return [];
      return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch { return []; }
  },

  async writeAnalytics<T>(data: T[], message?: string): Promise<void> {
    if (USE_GITHUB) return gh.writeJSON("data/analytics.json", data, message);
    fs.writeFileSync(path.join(DATA_DIR, "analytics.json"), JSON.stringify(data, null, 2));
  },

  isUsingGitHub(): boolean {
    return USE_GITHUB;
  },

  getBackendType(): string {
    return USE_GITHUB ? "GitHub API" : "Local Files";
  },
};