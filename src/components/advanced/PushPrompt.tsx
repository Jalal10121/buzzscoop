"use client";
import { useEffect, useState } from "react";
export function PushPrompt() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) return;
    if (localStorage.getItem("buzzscoop-push-dismissed")) return;
    const t = setTimeout(() => setVisible(true), 15000);
    return () => clearTimeout(t);
  }, []);
  function dismiss() {
    localStorage.setItem("buzzscoop-push-dismissed", "1");
    setVisible(false);
  }
  async function enable() {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    dismiss();
  }
  if (!visible) return null;
  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 bg-white border-2 border-yellow-400 rounded-xl shadow-2xl p-4 z-50">
      <button onClick={dismiss} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" aria-label="Close">✕</button>
      <div className="flex gap-3">
        <div className="text-3xl">🔔</div>
        <div className="flex-1">
          <h3 className="font-black text-lg">Never Miss Breaking News</h3>
          <p className="text-sm text-gray-600 mb-3">Get instant alerts for trending scoops.</p>
          <div className="flex gap-2">
            <button onClick={enable} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-1.5 rounded-lg text-sm">
              Enable Alerts
            </button>
            <button onClick={dismiss} className="text-sm text-gray-500 hover:text-gray-700 px-3">Not now</button>
          </div>
        </div>
      </div>
    </div>
  );
}