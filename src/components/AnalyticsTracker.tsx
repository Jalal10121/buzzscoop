"use client";

import { useEffect } from "react";

export function AnalyticsTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/admin/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        referrer: document.referrer || "direct",
        sessionDuration: 0,
      }),
    }).catch(() => {});
  }, [slug]);

  return null;
}