import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action, title, content } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: "OpenAI API key not configured. Add OPENAI_API_KEY to .env.local",
      fallback: true,
    });
  }

  const prompts: Record<string, string> = {
    headlines: `Generate 5 catchy, SEO-optimized headlines for an entertainment news article with this title: "${title}". Each headline should be under 60 characters and maximize click-through rate. Return only the headlines, numbered.`,
    improve: `Improve this article content for clarity, engagement, and SEO. Keep the same structure. Content:\n\n${content}`,
    seo: `Generate an SEO-optimized meta description (max 160 chars) and 5 relevant tags for an entertainment article titled: "${title}". Format: Description:\n<desc>\n\nTags:\n<comma separated>`,
    summary: `Summarize this article in 2-3 sentences for a news digest:\n\n${content}`,
    expand: `Expand this article content with more details, examples, and analysis. Keep the tone engaging. Content:\n\n${content}`,
  };

  const prompt = prompts[action] || prompts.improve;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert entertainment news editor for BuzzScoop. You help write catchy headlines, improve articles, and optimize for SEO and Google Discover.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  return NextResponse.json({ result: data.choices?.[0]?.message?.content || "No response" });
}