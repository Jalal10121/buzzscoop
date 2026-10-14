import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { scrapeTudum } from "@/lib/autonomous/scraper";
import { generateDraft } from "@/lib/autonomous/draft-generator";
import { queue } from "@/lib/autonomous/queue";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set. Add credits at platform.openai.com" },
      { status: 500 }
    );
  }

  // Step 1: Scrape
  const items = await scrapeTudum();
  if (items.length === 0) {
    return NextResponse.json({
      success: true,
      scraped: 0,
      generated: 0,
      message: "No new items found on Tudum",
    });
  }

  // Step 2: Generate drafts (max 3 at a time to save cost)
  const results = [];
  for (const item of items.slice(0, 3)) {
    const draft = await generateDraft(item, apiKey);
    if (draft) {
      const added = queue.add(draft);
      if (added) results.push(draft.title);
    }
  }

  return NextResponse.json({
    success: true,
    scraped: items.length,
    generated: results.length,
    titles: results,
    queueStats: queue.stats(),
  });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(queue.stats());
}