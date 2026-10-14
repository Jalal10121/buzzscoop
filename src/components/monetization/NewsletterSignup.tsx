"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // TODO: Connect to your email service (Mailchimp, ConvertKit, etc.)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
        <div className="text-4xl mb-2">✅</div>
        <h3 className="font-bold text-green-800 text-lg">You&apos;re subscribed!</h3>
        <p className="text-green-700 text-sm mt-1">Check your inbox to confirm.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 my-8">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-black">📬 Get Daily BuzzScoop</h3>
        <p className="text-gray-400 text-sm mt-1">
          Join 10,000+ entertainment fans. No spam.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
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
          className="px-6 py-3 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 disabled:opacity-50 transition"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>

      {status === "error" && (
        <p className="text-red-400 text-sm text-center mt-2">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}