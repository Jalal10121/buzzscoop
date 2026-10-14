"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("buzzscoop-theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = saved || (prefersDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("buzzscoop-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  if (!mounted) {
    return (
      <div
        style={{ width: "40px", height: "40px" }}
        className="rounded-full bg-gray-100 dark:bg-gray-800 flex-shrink-0"
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-lg"
      style={{ minWidth: "40px", minHeight: "40px" }}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}