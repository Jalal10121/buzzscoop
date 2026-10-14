"use client";

import { useEffect, useState } from "react";
import { marked } from "marked";

export function MarkdownRenderer({ content }: { content: string }) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!content) return;

    // Configure marked
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const parsed = marked.parse(content) as string;
    setHtml(parsed);
  }, [content]);

  return (
    <div
      className="prose prose-lg prose-gray dark:prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}