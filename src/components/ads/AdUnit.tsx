"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  className?: string;
}

export function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Only push in production
    if (process.env.NODE_ENV !== "production") return;
    if (pushed.current) return;
    if (!adRef.current) return;

    const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
    if (!clientId) return;

    // Skip if already has ad
    if (adRef.current.getAttribute("data-adsbygoogle-status")) return;

    try {
      pushed.current = true;
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.debug("AdSense push skipped");
      }
    }
  }, []);

  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Placeholder in development or when no client ID
  if (!clientId || process.env.NODE_ENV !== "production") {
    return (
      <div
        className={`bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center text-gray-400 text-xs ${className}`}
        style={{ minHeight: "90px" }}
      >
        Ad Space ({format})
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}