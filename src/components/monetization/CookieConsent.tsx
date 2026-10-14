"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("buzzscoop-cookie-consent");
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem("buzzscoop-cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("buzzscoop-cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-[100] shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <p className="text-sm flex-1">
          🍪 We use cookies to improve your experience and serve relevant ads. Read our{" "}
          <Link href="/privacy" className="text-yellow-400 underline">Privacy Policy</Link>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm font-medium border border-gray-600 rounded-lg hover:bg-gray-800"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-bold bg-yellow-400 text-black rounded-lg hover:bg-yellow-500"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}