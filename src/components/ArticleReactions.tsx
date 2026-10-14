"use client";
import { useEffect, useState } from "react";

const REACTIONS = [
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "like", emoji: "👍", label: "Like" },
  { key: "wow", emoji: "😮", label: "Wow" },
  { key: "fire", emoji: "🔥", label: "Fire" },
  { key: "sad", emoji: "😢", label: "Sad" },
];

export function ArticleReactions({ slug }: { slug: string }) {
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`reactions-${slug}`);
      const counts = localStorage.getItem(`reactions-count-${slug}`);
      if (saved) setUserReaction(saved);
      if (counts) setReactions(JSON.parse(counts));
    } catch {}
  }, [slug]);

  function react(key: string) {
    if (userReaction === key) return;
    const updated = { ...reactions };
    if (userReaction) updated[userReaction] = Math.max(0, (updated[userReaction] || 0) - 1);
    updated[key] = (updated[key] || 0) + 1;
    setReactions(updated);
    setUserReaction(key);
    try {
      localStorage.setItem(`reactions-${slug}`, key);
      localStorage.setItem(`reactions-count-${slug}`, JSON.stringify(updated));
    } catch {}
  }

  return (
    <div className="my-8 py-6 border-y border-gray-200 dark:border-gray-800 text-center">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4">
        What did you think of this article?
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => react(r.key)}
            aria-label={r.label}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition ${
              userReaction === r.key
                ? "bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-400"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <span className="text-2xl">{r.emoji}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {reactions[r.key] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}