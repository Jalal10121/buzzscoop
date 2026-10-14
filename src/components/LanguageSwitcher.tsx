"use client";
import { useEffect, useState } from "react";

const LANGS = [
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "hi", label: "HI", flag: "🇮🇳" },
];

export function LanguageSwitcher() {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem("buzzscoop-lang") || "en";
    setLang(saved);
  }, []);

  function change(code: string) {
    setLang(code);
    localStorage.setItem("buzzscoop-lang", code);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          className={`px-2 py-1 rounded text-xs font-bold ${
            lang === l.code ? "bg-yellow-400 text-black" : "bg-gray-100 text-gray-600"
          }`}
          aria-label={l.label}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}