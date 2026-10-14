"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const categories = [
  { href: "/category/netflix", label: "Netflix", emoji: "🎬" },
  { href: "/category/hollywood", label: "Hollywood", emoji: "🌟" },
  { href: "/category/marvel", label: "Marvel", emoji: "🦸" },
  { href: "/category/music", label: "Music", emoji: "🎵" },
  { href: "/category/streaming", label: "Streaming", emoji: "📺" },
  { href: "/category/tv", label: "TV Shows", emoji: "📻" },
  { href: "/category/awards", label: "Awards", emoji: "🏆" },
  { href: "/category/celeb", label: "Celebrity", emoji: "💫" },
];

export function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-yellow-600"
      >
        Categories <span className="text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="py-2">
            {categories.map((cat) => (
              <li key={cat.href}>
                <Link
                  href={cat.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700"
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}