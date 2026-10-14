"use client";
import { useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function toggle() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", toggle);
    return () => window.removeEventListener("scroll", toggle);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-yellow-400 text-black font-bold shadow-lg hover:bg-yellow-500 transition z-50 cursor-pointer text-xl"
    >
      ↑
    </button>
  );
}