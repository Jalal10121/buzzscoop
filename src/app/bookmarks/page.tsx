"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Metadata } from "next";

interface Bookmark {
  slug: string;
  title: string;
  savedAt: number;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const data = JSON.parse(localStorage.getItem("buzzscoop-bookmarks") || "[]");
      setBookmarks(data.sort((a: Bookmark, b: Bookmark) => b.savedAt - a.savedAt));
    } catch {}
  }, []);

  function clearAll() {
    if (!confirm("Remove all bookmarks?")) return;
    localStorage.removeItem("buzzscoop-bookmarks");
    setBookmarks([]);
  }

  if (!mounted) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black mb-6">🔖 Bookmarks</h1>
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-black">🔖 Bookmarks</h1>
        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 mb-4">No bookmarks yet.</p>
          <Link
            href="/"
            className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500"
          >
            Browse Articles
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {bookmarks.map((b) => (
            <li
              key={b.slug}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-yellow-400 transition"
            >
              <Link
                href={`/blog/${b.slug}`}
                className="flex-1 font-medium hover:text-yellow-600"
              >
                {b.title}
              </Link>
              <time className="text-xs text-gray-500 ml-4">
                {new Date(b.savedAt).toLocaleDateString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}