import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { trends } from "@/lib/trends";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    stats: trends.stats(),
    trends: trends.all().slice(0, 100),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { action } = body;

  if (action === "add") {
    const { topic, keyword, category, source, country } = body;
    if (!topic || !keyword) {
      return NextResponse.json({ error: "Topic and keyword required" }, { status: 400 });
    }
    const entry = trends.add({
      topic,
      keyword,
      category: category || "Netflix",
      source: source || "google-trends",
      country: country || "US",
    });
    return NextResponse.json(entry);
  }

  if (action === "used") {
    trends.markUsed(body.id, body.slug || "");
    return NextResponse.json({ success: true });
  }  if (action === "edit") {
    const { id, topic, keyword, category } = body;
    const all = trends.all();
    const t = all.find((x) => x.id === id);
    if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
    t.topic = topic || t.topic;
    t.keyword = keyword || t.keyword;
    t.category = category || t.category;
    // Save back
    const fs = require("fs");
    const path = require("path");
    const p = path.join(process.cwd(), "data", "trends-history.json");
    fs.writeFileSync(p, JSON.stringify(all, null, 2));
    return NextResponse.json(t);
  }



  if (action === "skip") {
    trends.markSkipped(body.id);
    return NextResponse.json({ success: true });
  }

  if (action === "remove") {
    trends.remove(body.id);
    return NextResponse.json({ success: true });
  }

  if (action === "clear") {
    trends.clear();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}