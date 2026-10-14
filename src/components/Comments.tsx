"use client";
import { useEffect, useState } from "react";

interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export function Comments({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [slug]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.content) return;

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...form }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Comment submitted! It will appear after moderation.");
        setForm({ name: "", email: "", content: "" });
      } else {
        setMessage("❌ " + (data.error || "Failed to submit"));
      }
    } catch (err) {
      setMessage("❌ Network error. Try again.");
    }

    setSubmitting(false);
  }

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    if (seconds < 604800) return Math.floor(seconds / 86400) + "d ago";
    return new Date(date).toLocaleDateString();
  }

  function getInitial(name: string) {
    return name.charAt(0).toUpperCase();
  }

  function getColor(name: string) {
    const colors = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500"];
    const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }

  return (
    <section className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-black mb-6 dark:text-white">
        💬 Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment Form */}
      <form onSubmit={submit} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-8">
        <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-3">
          Leave a comment
        </h3>

        <div className="grid gap-3 sm:grid-cols-2 mb-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Your name *"
            maxLength={50}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email (optional, not shown)"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400"
          />
        </div>

        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          rows={4}
          placeholder="Your comment..."
          maxLength={2000}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:border-yellow-400 mb-3"
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {form.content.length}/2000 characters
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold px-5 py-2 rounded-lg cursor-pointer transition"
          >
            {submitting ? "Posting..." : "Post Comment"}
          </button>
        </div>

        {message && (
          <p className={`mt-3 text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </form>

      {/* Comments List */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading comments...</p>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className={`w-10 h-10 rounded-full ${getColor(c.name)} flex items-center justify-center text-white font-black flex-shrink-0`}>
                {getInitial(c.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm dark:text-white">{c.name}</span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">{timeAgo(c.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}