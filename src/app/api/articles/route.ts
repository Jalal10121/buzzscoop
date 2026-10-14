import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/mdx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = getAllPosts();

    const headlines = posts.slice(0, 10).map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      category: p.category,
    }));

    return NextResponse.json(headlines, {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      {
        error: "Failed to load articles",
        details: String(err),
      },
      { status: 500 }
    );
  }
}