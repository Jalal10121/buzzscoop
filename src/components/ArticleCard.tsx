"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import type { Post } from "@/lib/mdx";
import { timeAgo, readTime, getAuthorInitial, getAuthorColor } from "@/lib/utils";

interface Props {
  post: Post;
  priority?: boolean;
}

export function ArticleCard({ post, priority = false }: Props) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem("buzzscoop-bookmarks") || "[]");
      setSaved(bookmarks.some((b: any) => b.slug === post.slug));
    } catch {}
  }, [post.slug]);

  function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      const bookmarks = JSON.parse(localStorage.getItem("buzzscoop-bookmarks") || "[]");
      if (saved) {
        const updated = bookmarks.filter((b: any) => b.slug !== post.slug);
        localStorage.setItem("buzzscoop-bookmarks", JSON.stringify(updated));
        setSaved(false);
      } else {
        bookmarks.push({ slug: post.slug, title: post.title, savedAt: Date.now() });
        localStorage.setItem("buzzscoop-bookmarks", JSON.stringify(bookmarks));
        setSaved(true);
      }
    } catch {}
  }

  async function share(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/blog/${post.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, url });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  }

  const imageUrl = post.image || "/placeholder.svg";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block cursor-pointer rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-yellow-400 dark:hover:border-yellow-500"
    >
      {/* IMAGE */}
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {!imgError ? (
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-gray-800 dark:to-gray-700">
            <span className="text-4xl">📰</span>
          </div>
        )}

        {/* Category badge */}
        <span className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-black px-2 py-1 rounded-md shadow-md uppercase tracking-wide z-10">
          {post.category}
        </span>

        {/* Save button */}
        <button
          onClick={toggleSave}
          aria-label={saved ? "Remove bookmark" : "Save article"}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all z-10 ${
            saved
              ? "bg-yellow-400 text-black shadow-lg"
              : "bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
          }`}
        >
          {saved ? "🔖" : "☆"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="p-4 sm:p-5">
        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>🕐 {timeAgo(post.date)}</span>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <span>{readTime(post.content || "")}</span>
        </div>

        {/* Title */}
        <h2 className="text-sm sm:text-base lg:text-lg font-bold leading-snug line-clamp-2 text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
          {post.description}
        </p>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black text-white ${getAuthorColor(post.author)}`}>
              {getAuthorInitial(post.author)}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
              {post.author}
            </span>
          </div>

          <button
            onClick={share}
            aria-label="Share article"
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm cursor-pointer transition-all bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100"
          >
            {copied ? "✅" : "↗"}
          </button>
        </div>
      </div>
    </Link>
  );
}