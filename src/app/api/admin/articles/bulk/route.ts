import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

interface Article {
  id: string;
  slug: string;
  title: string;
  [key: string]: unknown;
}

const DATA_DIR = path.join(process.cwd(), "data");

function readArticles(): Article[] {
  try {
    const p = path.join(DATA_DIR, "articles.json");
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch { return []; }
}

function writeArticles(data: Article[]) {
  fs.writeFileSync(path.join(DATA_DIR, "articles.json"), JSON.stringify(data, null, 2));
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, ids } = await req.json();
  if (!action || !Array.isArray(ids)) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  let articles = readArticles();

  if (action === "delete") {
    articles = articles.filter((a) => !ids.includes(a.id));
  } else if (action === "feature") {
    articles = articles.map((a) => ids.includes(a.id) ? { ...a, featured: true } : a);
  } else if (action === "unfeature") {
    articles = articles.map((a) => ids.includes(a.id) ? { ...a, featured: false } : a);
  } else if (action === "publish") {
    articles = articles.map((a) => ids.includes(a.id) ? { ...a, status: "published" } : a);
  } else if (action === "draft") {
    articles = articles.map((a) => ids.includes(a.id) ? { ...a, status: "draft" } : a);
  }

  writeArticles(articles);
  revalidatePath("/");

  return NextResponse.json({ success: true, count: ids.length });
}