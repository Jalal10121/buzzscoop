"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Headline {
  slug: string;
  title: string;
}

export function BreakingTicker() {
  const [headlines, setHeadlines] = useState<Headline[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Public API — no auth required
    fetch("/api/articles")
      .then((r) => r.json())
      .then((articles: Headline[]) => {
        if (Array.isArray(articles)) {
          setHeadlines(articles.slice(0, 5));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (headlines.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % headlines.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [headlines]);

  if (headlines.length === 0) return null;

  return (
    <div className="bg-red-600 text-white py-1.5 sm:py-2">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 flex items-center gap-2 sm:gap-3">
        <span className="flex-shrink-0 bg-white text-red-600 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-black animate-pulse">
          🔴 BREAKING
        </span>
        <Link
          href={`/blog/${headlines[current].slug}`}
          className="flex-1 text-xs sm:text-sm font-bold truncate hover:underline"
        >
          {headlines[current].title}
        </Link>
      </div>
    </div>
  );
}