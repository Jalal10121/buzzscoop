"use client";
import { useEffect, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Extract ## and ### headings from markdown
    const lines = content.split("\n");
    const found: Heading[] = [];

    lines.forEach((line, i) => {
      const h2 = line.match(/^## (.+)$/);
      const h3 = line.match(/^### (.+)$/);
      if (h2) {
        found.push({
          id: "heading-" + i,
          text: h2[1].trim(),
          level: 2,
        });
      } else if (h3) {
        found.push({
          id: "heading-" + i,
          text: h3[1].trim(),
          level: 3,
        });
      }
    });

    setHeadings(found);
  }, [content]);

  if (headings.length < 3) return null;

  return (
    <nav className="my-8 p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl">
      <h3 className="font-black text-sm uppercase tracking-wide text-blue-900 dark:text-blue-300 mb-3">
        📑 Table of Contents
      </h3>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? "16px" : "0" }}>
            <span className="text-blue-700 dark:text-blue-400">
              {h.level === 3 ? "› " : "• "}
              {h.text}
            </span>
          </li>
        ))}
      </ul>
    </nav>
  );
}