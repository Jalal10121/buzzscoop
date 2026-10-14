"use client";
import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 800));
    setStatus("success");
    setEmail("");
  }

  if (status === "success") {
    return (
      <div className="my-8 p-6 bg-green-50 dark:bg-green-950/30 border-2 border-green-500 rounded-xl text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-black text-green-800 dark:text-green-400">Subscribed!</h3>
        <p className="text-sm text-green-700 dark:text-green-500 mt-1">Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <div className="my-8 p-6 bg-gray-900 dark:bg-gray-800 rounded-xl">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-black text-white">📬 Get Daily BuzzScoop</h3>
        <p className="text-sm text-gray-400 mt-1">Join 10,000+ fans. No spam.</p>
      </div>
      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          className="flex-1 px-4 py-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold rounded-lg cursor-pointer transition"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
    </div>
  );
}