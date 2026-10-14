import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { buildArticlePrompt, ARTICLE_SYSTEM_PROMPT, PROMPT_TEMPLATES } from "@/lib/ai-prompts";
import { logAudit } from "@/lib/security/audit-log";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { topic, keyword, category, type = "general", wordCount = 900 } = body;

  if (!topic || !keyword || !category) {
    return NextResponse.json(
      { error: "Topic, keyword, and category required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not set in .env.local", setup: true },
      { status: 500 }
    );
  }

  // Build prompt with template
  let prompt = buildArticlePrompt(topic, keyword, category, wordCount);
  if (type && type !== "general" && PROMPT_TEMPLATES[type as keyof typeof PROMPT_TEMPLATES]) {
    prompt = PROMPT_TEMPLATES[type as keyof typeof PROMPT_TEMPLATES] + "\n\n" + prompt;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: ARTICLE_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.8,
      }),
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json(
        { error: data.error.message || "OpenAI error" },
        { status: 500 }
      );
    }

    const article = data.choices?.[0]?.message?.content || "";

    logAudit({
      action: "ai_writer.generate",
      user: user.username,
      success: true,
      details: { topic, category },
    });

    return NextResponse.json({ article });
  } catch (err) {
    logAudit({
      action: "ai_writer.error",
      user: user.username,
      success: false,
      details: { error: String(err) },
    });
    return NextResponse.json(
      { error: String(err) },
      { status: 500 }
    );
  }
}