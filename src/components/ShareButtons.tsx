"use client";
import { useState } from "react";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const eu = encodeURIComponent(url);
  const et = encodeURIComponent(title);

  const platforms = [
    { name: "Twitter", icon: "𝕏", href: `https://twitter.com/intent/tweet?url=${eu}&text=${et}` },
    { name: "Facebook", icon: "f", href: `https://www.facebook.com/sharer/sharer.php?u=${eu}` },
    { name: "WhatsApp", icon: "💬", href: `https://wa.me/?text=${et}%20${eu}` },
    { name: "Reddit", icon: "r", href: `https://reddit.com/submit?url=${eu}&title=${et}` },
    { name: "LinkedIn", icon: "in", href: `https://www.linkedin.com/sharing/share-offsite/?url=${eu}` },
  ];

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 my-6 py-4 border-y border-gray-200 dark:border-gray-800">
      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 mr-2">Share:</span>
      {platforms.map((p) => (
        <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" aria-label={p.name}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-400 hover:text-black transition text-sm font-bold cursor-pointer">
          {p.icon}
        </a>
      ))}
      <button onClick={copy} className="ml-auto text-xs font-medium text-gray-500 hover:text-yellow-600 cursor-pointer">
        {copied ? "✅ Copied!" : "📋 Copy Link"}
      </button>
    </div>
  );
}