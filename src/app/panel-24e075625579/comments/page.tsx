"use client";
import { useEffect, useState } from "react";

interface Comment {
  id: string;
  slug: string;
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "spam";
  createdAt: string;
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "spam">("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
    // Auto refresh every 30 seconds
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/admin/comments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  async function del(id: string) {
    if (!confirm("Delete this comment?")) return;
    await fetch(`/api/admin/comments?id=${id}`, { method: "DELETE" });
    load();
  }

  const filtered = filter === "all" ? comments : comments.filter((c) => c.status === filter);

  function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return Math.floor(seconds / 60) + "m ago";
    if (seconds < 86400) return Math.floor(seconds / 3600) + "h ago";
    return Math.floor(seconds / 86400) + "d ago";
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-black dark:text-white">💬 Comments</h1>
        <button
          onClick={load}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold px-4 py-2 rounded-lg text-sm cursor-pointer"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "approved", "spam"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-bold capitalize cursor-pointer transition ${
              filter === f
                ? "bg-yellow-400 text-black"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 dark:text-white"
            }`}
          >
            {f} ({f === "all" ? comments.length : comments.filter((c) => c.status === f).length})
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-6xl mb-4">💬</div>
          <p className="text-gray-500 dark:text-gray-400">
            No {filter} comments.
          </p>
          {filter === "pending" && (
            <p className="text-xs text-gray-400 mt-2">
              Comments will appear here when users submit them.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5"
            >
              <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
                <div>
                  <p className="font-bold dark:text-white">{c.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {c.email || "no email"} • {timeAgo(c.createdAt)}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    on /blog/{c.slug}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-bold ${
                    c.status === "approved"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : c.status === "spam"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {c.status.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 break-words">
                {c.content}
              </p>

              <div className="flex gap-2 flex-wrap">
                {c.status !== "approved" && (
                  <button
                    onClick={() => updateStatus(c.id, "approved")}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition"
                  >
                    ✅ Approve
                  </button>
                )}
                {c.status !== "spam" && (
                  <button
                    onClick={() => updateStatus(c.id, "spam")}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition"
                  >
                    🚫 Mark Spam
                  </button>
                )}
                {c.status === "approved" && (
                  <button
                    onClick={() => updateStatus(c.id, "pending")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition"
                  >
                    ↩️ Unapprove
                  </button>
                )}
                <button
                  onClick={() => del(c.id)}
                  className="text-red-600 hover:underline text-xs ml-auto cursor-pointer"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}