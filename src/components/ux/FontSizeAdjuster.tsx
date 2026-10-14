"use client";

import { useState, useEffect } from "react";

type Size = "sm" | "base" | "lg" | "xl";

const SIZES: Size[] = ["sm", "base", "lg", "xl"];

export function FontSizeAdjuster() {
  const [size, setSize] = useState<Size>("base");

  useEffect(() => {
    const saved = localStorage.getItem("buzzscoop-font-size") as Size | null;
    if (saved && SIZES.includes(saved)) {
      setSize(saved);
      applySize(saved);
    }
  }, []);

  function applySize(s: Size) {
    const article = document.querySelector(".prose");
    if (article) {
      article.classList.remove("text-sm", "text-base", "text-lg", "text-xl");
      article.classList.add(`text-${s}`);
    }
  }

  function changeSize(s: Size) {
    setSize(s);
    localStorage.setItem("buzzscoop-font-size", s);
    applySize(s);
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="text-gray-500 mr-1">A:</span>
      {SIZES.map((s) => (
        <button
          key={s}
          onClick={() => changeSize(s)}
          className={`w-6 h-6 rounded flex items-center justify-center font-bold transition ${
            size === s
              ? "bg-yellow-400 text-black"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-label={`Font size ${s}`}
        >
          {s === "sm" ? "A" : s === "base" ? "A" : s === "lg" ? "A" : "A"}
        </button>
      ))}
    </div>
  );
}