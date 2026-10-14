/**
 * AI Prompts Library
 * Master prompts for article writing + image generation
 */

export const ARTICLE_SYSTEM_PROMPT = `You are a senior entertainment journalist at BuzzScoop, a top US entertainment news site. You've been writing for 10+ years, and your articles consistently rank #1 on Google Discover.

STRICT REQUIREMENTS:
1. STRUCTURE: Catchy title (60 chars), SEO description (155 chars), opening hook, 4-6 H2 sections, bullets, table if relevant, bottom line, CTA
2. WRITING STYLE: Conversational, human tone, short paragraphs, no AI clichés (avoid "delve", "tapestry", "testament", "in conclusion")
3. SEO: Keyword in title, first paragraph, 1 H2, conclusion. Natural LSI keywords.
4. ENGAGEMENT: 1 hot take, 1 prediction, 1 question to reader
5. FORMATTING: **bold** for facts, *italics* for titles, > for quotes, | tables |
6. OUTPUT: Only article content in Markdown. No intro. No explanation.`;

export function buildArticlePrompt(topic: string, keyword: string, category: string, wordCount = 900): string {
  return `TASK: Write a complete, publish-ready article.

ARTICLE TOPIC: ${topic}
TARGET KEYWORD: ${keyword}
CATEGORY: ${category}
WORD COUNT: ${wordCount} words

Write the article in Markdown format with this frontmatter:
---
title: "[60-char title with power word like Confirmed/Leaked/Everything We Know]"
description: "[155-char SEO description with keyword]"
date: "${new Date().toISOString().split("T")[0]}"
image: ""
category: "${category}"
author: "BuzzScoop Team"
---

Then the article content.

Write now. Only output the article. No explanation.`;
}

export const IMAGE_PROMPT_TEMPLATE = `Create a professional entertainment news featured image.

TOPIC: {TOPIC}
MOOD: {MOOD}
COLOR: {COLOR}

REQUIREMENTS:
- Size: 1200x630px
- Style: Cinematic, editorial, magazine-quality
- NO text, NO logos, NO real celebrity faces
- Rule of thirds, dramatic lighting

NEGATIVE: text, watermark, cartoon, low quality, real faces, brand logos

OUTPUT: Just the image.`;

export function buildImagePrompt(topic: string, mood = "Cinematic", color = "Dark + Yellow accent"): string {
  return IMAGE_PROMPT_TEMPLATE
    .replace("{TOPIC}", topic)
    .replace("{MOOD}", mood)
    .replace("{COLOR}", color);
}

// Pre-built prompt templates for different article types
export const PROMPT_TEMPLATES = {
  breaking: `Write a BREAKING NEWS article. Lead with "BREAKING:" and be extremely urgent. Short paragraphs. Include what we know, what we don't know, and what happens next.`,
  leaked: `Write a LEAKED/RUMOR article. Emphasize that this is unconfirmed. Use phrases like "according to insiders", "sources say". Include disclaimer.`,
  confirmed: `Write a CONFIRMED news article. Use official sources. Include release date, cast, plot in structured format.`,
  listicle: `Write a TOP 10 / LISTICLE article. Number each item. Include brief description for each. Add rankings reasoning.`,
  review: `Write a REVIEW article. Include rating (out of 10), pros, cons, and final verdict. Compare to similar content.`,
  everything: `Write an "EVERYTHING WE KNOW" article. Cover: what it is, release date, cast, plot, rumors, predictions. Use table for quick facts.`,
};