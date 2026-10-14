import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { backend } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const articles = await backend.readArticles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (!body.title || !body.content) {
    return NextResponse.json({ error: "Title and content required" }, { status: 400 });
  }

  const slug = body.slug || body.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const newArticle = {
    id: Date.now().toString(),
    title: body.title,
    slug,
    description: body.description || "",
    content: body.content,
    image: body.image || "",
    category: body.category || "Netflix",
    author: body.author || "BuzzScoop Team",
    date: body.date || new Date().toISOString(),
    featured: body.featured || false,
    tags: body.tags || [],
    status: body.status || "published",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const articles = await backend.readArticles();
  articles.unshift(newArticle);
  await backend.writeArticles(articles, `Add article: ${newArticle.title}`);

  revalidatePath("/");
  revalidatePath(`/blog/${slug}`);
  revalidatePath(`/category/${newArticle.category.toLowerCase()}`);
  revalidatePath("/sitemap.xml");

  return NextResponse.json(newArticle);
}