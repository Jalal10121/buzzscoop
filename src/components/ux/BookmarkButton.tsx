"use client";

import { useState, useEffect } from "react";

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

interface Bookmark {
  slug: string;
  title: string;
  savedAt: number;
}

export function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const bookmarks = getBookmarks();
    setSaved(bookmarks.some((b) => b.slug === slug));
  }, [slug]);

  function getBookmarks(): Bookmark[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("buzzscoop-bookmarks") || "[]");
    } catch {
      return [];
    }
  }

  function toggle() {
    const bookmarks = getBookmarks();
    if (saved) {
      const updated = bookmarks.filter((b) => b.slug !== slug);
      localStorage.setItem("buzzscoop-bookmarks", JSON.stringify(updated));
      setSaved(false);
    } else {
      bookmarks.push({ slug, title, savedAt: Date.now() });
      localStorage.setItem("buzzscoop-bookmarks", JSON.stringify(bookmarks));
      setSaved(true);
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remove bookmark" : "Save article"}
      className={`flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full transition ${
        saved
          ? "bg-yellow-400 text-black"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {saved ? "🔖 Saved" : "🔖 Save"}
    </button>
  );
}