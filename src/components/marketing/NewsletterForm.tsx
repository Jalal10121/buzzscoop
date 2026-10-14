"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;

    try {
      if (endpoint) {
        // Beehiiv / Mailchimp / ConvertKit endpoint
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) throw new Error("Subscription failed");
      } else {
        // Demo mode
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center p-6 bg-green-50 border-2 border-green-500 rounded-xl">
        <div className="text-4xl mb-2">🎉</div>
        <h3 className="font-black text-green-800 text-lg">Subscribed!</h3>
        <p className="text-green-700 text-sm mt-1">Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-yellow-400 focus:outline-none text-black"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-black py-3 rounded-lg transition"
      >
        {status === "loading" ? "Subscribing..." : "Subscribe Free →"}
      </button>
      {status === "error" && (
        <p className="text-red-600 text-sm text-center">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}