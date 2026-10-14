"use client";
import { useEffect, useRef } from "react";

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "Jalal10121/buzzscoop");
    script.setAttribute("data-repo-id", "R_kgDONxxxxxxxx");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "DIC_kwDONxxxxxxxx");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "en");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return (
    <section className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-black mb-6 dark:text-white">💬 Comments</h2>
      <div ref={ref} />
    </section>
  );
}