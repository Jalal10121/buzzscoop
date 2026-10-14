/**
 * AI Draft Generator
 * Creates safe, rewritten article drafts from scraped topics
 */

import type { ScrapedItem } from "./scraper";

export interface DraftArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string;
  imagePrompt: string;
  category: string;
  author: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  sourceUrl: string;
  createdAt: string;
}

const SYSTEM_PROMPT = `You are a senior entertainment journalist at BuzzScoop, a top US entertainment news site.

IMPORTANT RULES:
1. NEVER copy the source content directly
2. Rewrite completely in your own words
3. Add original analysis, context, and insight
4. Attribute Netflix as the source when relevant
5. Write like a human journalist, not an AI
6. No AI clichés (delve, tapestry, testament, in conclusion)

STRUCTURE:
- Catchy title (60 chars, power words)
- SEO description (155 chars)
- Opening hook (2-3 sentences)
- 4-6 H2 sections
- Bullets and table
- Bottom line
- CTA

Write in Markdown with frontmatter:
---
title: "[title]"
description: "[description]"
date: "[YYYY-MM-DD]"
image: ""
category: "[category]"
author: "BuzzScoop Team"
---

Only output the article. No explanation.`;

export async function generateDraft(
  item: ScrapedItem,
  apiKey: string
): Promise<DraftArticle | null> {
  const prompt = `Write a 900-word news article based on this Netflix Tudum topic.

TOPIC TITLE: ${item.title}
NETFLIX DESCRIPTION: ${item.description}
CATEGORY: ${item.category}

Rewrite this as an original BuzzScoop article. Add context, analysis, and predictions. Do NOT copy the Netflix description directly.

Write now. Only output the article.`;

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
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 3000,
        temperature: 0.8,
      }),
    });

    const data = await res.json();
    if (data.error) {
      console.error("AI error:", data.error.message);
      return null;
    }

    const article = data.choices?.[0]?.message?.content || "";
    if (!article) return null;

    // Parse frontmatter
    const match = article.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const frontmatter: Record<string, string> = {};
    match[1].split("\n").forEach((line) => {
      const [key, ...val] = line.split(":");
      if (key && val.length) {
        frontmatter[key.trim()] = val.join(":").trim().replace(/^"|"$/g, "");
      }
    });

    const slug = (frontmatter.title || item.title)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    return {
      id: `draft-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: frontmatter.title || item.title,
      slug,
      description: frontmatter.description || item.description,
      content: match[2],
      image: "",
      imagePrompt: buildImagePrompt(item),
      category: item.category,
      author: "BuzzScoop Team",
      date: frontmatter.date || new Date().toISOString().split("T")[0],
      status: "pending",
      sourceUrl: item.sourceUrl,
      createdAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error("Draft generation error:", err);
    return null;
  }
}

function buildImagePrompt(item: ScrapedItem): string {
  const t = item.title.toLowerCase();
  let mood = "Cinematic";
  let color = "Dark + Yellow accent";

  if (t.includes("thriller") || t.includes("horror") || t.includes("dark")) {
    mood = "Dark, mysterious, cinematic";
    color = "Black + Red accent";
  } else if (t.includes("comedy") || t.includes("fun")) {
    mood = "Fun, bright, energetic";
    color = "Yellow + Orange";
  } else if (t.includes("romance") || t.includes("love")) {
    mood = "Romantic, warm";
    color = "Pink + Gold";
  }

  return `Cinematic editorial image for Netflix news article.

TOPIC: ${item.title}
MOOD: ${mood}
COLOR: ${color}

REQUIREMENTS:
- Size 1200x630px (16:9)
- Style: Cinematic, magazine-quality
- NO text, NO logos, NO real faces
- Rule of thirds, dramatic lighting

OUTPUT: Just the image.`;
}