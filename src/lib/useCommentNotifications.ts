"use client";
import { useEffect, useRef } from "react";

export function useCommentNotifications() {
  const lastCountRef = useRef(0);

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch("/api/admin/comments");
        const data = await res.json();
        if (!Array.isArray(data)) return;

        const pending = data.filter((c) => c.status === "pending").length;

        // Check if new comments arrived
        if (pending > lastCountRef.current && lastCountRef.current !== 0) {
          // Browser notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("🔔 BuzzScoop: New Comment", {
              body: "A new comment is waiting for approval.",
              icon: "/favicon.ico",
              tag: "buzzscoop-comment",
            });
          }

          // Sound alert (optional)
          try {
            const audio = new Audio("/notification.mp3");
            audio.volume = 0.3;
            await audio.play().catch(() => {});
          } catch {}
        }

        lastCountRef.current = pending;
      } catch {}
    }

    // Request permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    // Check every 30 seconds
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);
}