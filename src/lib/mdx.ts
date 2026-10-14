import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DATA_DIR = path.join(process.cwd(), "data");
const MDX_DIR = path.join(process.cwd(), "src/content/blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  image: string;
  category: string;
  author: string;
}

export interface Post extends PostFrontmatter {
  slug: string;
  content: string;
  featured?: boolean;
  tags?: string[];
}

interface DBArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  featured?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

function readJSON<T>(file: string, fallback: T): T {
  try {
    const p = path.join(DATA_DIR, file);
    if (!fs.existsSync(p)) return fallback;
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return fallback;
  }
}

// CMS Articles (PRIMARY)
function getCMSArticles(): Post[] {
  const articles = readJSON<DBArticle[]>("articles.json", []);
  return articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    description: a.description,
    content: a.content,
    image: a.image,
    category: a.category,
    author: a.author,
    date: a.date,
    featured: a.featured,
    tags: a.tags,
  }));
}

// MDX Articles (BACKUP — only used if CMS empty)
function getMDXArticles(): Post[] {
  if (!fs.existsSync(MDX_DIR)) return [];
  return fs
    .readdirSync(MDX_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(MDX_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      return { slug, content, ...(data as PostFrontmatter) };
    });
}

// Get all posts (CMS first, MDX fallback)
export function getAllPosts(): Post[] {
  const cms = getCMSArticles();
  const mdx = getMDXArticles();

  // Merge: CMS articles primary, MDX only if not in CMS
  const cmsSlugs = new Set(cms.map((a) => a.slug));
  const mdxOnly = mdx.filter((m) => !cmsSlugs.has(m.slug));

  const merged = [...cms, ...mdxOnly];
  return merged.sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Get single post
export function getPostBySlug(slug: string): Post | null {
  // Try CMS first
  const cms = getCMSArticles();
  const found = cms.find((a) => a.slug === slug);
  if (found) return found;

  // Fallback to MDX
  const fullPath = path.join(MDX_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  return { slug, content, ...(data as PostFrontmatter) };
}

// Get featured posts
export function getFeaturedPosts(): Post[] {
  return getAllPosts().filter((p) => p.featured).slice(0, 5);
}

// Get posts by category
export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}