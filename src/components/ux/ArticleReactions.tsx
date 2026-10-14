"use client";

import { useState, useEffect } from "react";

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
    const saved = localStorage.getItem(`buzzscoop-reactions-${slug}`);
    const counts = localStorage.getItem(`buzzscoop-reaction-counts-${slug}`);
    if (saved) setUserReaction(saved);
    if (counts) {
      try { setReactions(JSON.parse(counts)); } catch {}
    }
  }, [slug]);

  function react(key: string) {
    if (userReaction === key) return;

    const newReactions = { ...reactions };
    if (userReaction) {
      newReactions[userReaction] = Math.max(0, (newReactions[userReaction] || 0) - 1);
    }
    newReactions[key] = (newReactions[key] || 0) + 1;

    setReactions(newReactions);
    setUserReaction(key);
    localStorage.setItem(`buzzscoop-reactions-${slug}`, key);
    localStorage.setItem(`buzzscoop-reaction-counts-${slug}`, JSON.stringify(newReactions));
  }

  return (
    <div className="my-8 py-6 border-y border-gray-200 text-center">
      <p className="text-sm font-bold text-gray-700 mb-4">
        What did you think of this article?
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            onClick={() => react(r.key)}
            aria-label={r.label}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition ${
              userReaction === r.key
                ? "bg-yellow-100 ring-2 ring-yellow-400"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="text-2xl">{r.emoji}</span>
            <span className="text-xs text-gray-600">
              {reactions[r.key] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}