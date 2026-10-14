import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { backend } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const articles = await backend.readArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const articles = await backend.readArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const old = articles[idx];
  const revisions = old.revisions || [];
  revisions.push({ content: old.content, updatedAt: new Date().toISOString() });

  articles[idx] = {
    ...old,
    ...body,
    revisions: revisions.slice(-10),
    updatedAt: new Date().toISOString(),
  };

  await backend.writeArticles(articles, `Update article: ${articles[idx].title}`);

  revalidatePath("/");
  revalidatePath(`/blog/${articles[idx].slug}`);
  revalidatePath(`/category/${articles[idx].category.toLowerCase()}`);

  return NextResponse.json(articles[idx]);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const articles = await backend.readArticles();
  const article = articles.find((a) => a.id === id);
  const filtered = articles.filter((a) => a.id !== id);

  await backend.writeArticles(filtered, `Delete article: ${article?.title || id}`);

  revalidatePath("/");
  if (article) revalidatePath(`/blog/${article.slug}`);

  return NextResponse.json({ success: true });
}