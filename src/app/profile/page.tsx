"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    try {
      const cookie = document.cookie.split(";").find((c) => c.trim().startsWith("buzzscoop-reader="));
      if (!cookie) {
        window.location.href = "/signin";
        return;
      }
      const payload = JSON.parse(atob(cookie.split(".")[1] || ""));
      setUser({ name: payload.name, email: payload.email });
    } catch {
      window.location.href = "/signin";
    }

    try {
      const saved = JSON.parse(localStorage.getItem("buzzscoop-bookmarks") || "[]");
      setBookmarks(saved);
    } catch {}
  }, []);

  async function logout() {
    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.href = "/";
  }

  if (!user) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-black text-black mx-auto mb-4">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h1 className="text-3xl font-black">{user.name}</h1>
        <p className="text-gray-500">{user.email}</p>
        <button onClick={logout} className="mt-4 text-sm text-red-600 hover:underline">
          Sign out
        </button>
      </div>

      <section className="bg-white rounded-xl border p-6">
        <h2 className="text-xl font-black mb-4">🔖 Your Bookmarks ({bookmarks.length})</h2>
        {bookmarks.length === 0 ? (
          <p className="text-gray-400 text-sm">
            No bookmarks yet. <Link href="/" className="text-yellow-600">Browse articles →</Link>
          </p>
        ) : (
          <ul className="space-y-2">
            {bookmarks.map((b) => (
              <li key={b.slug}>
                <Link href={`/blog/${b.slug}`} className="text-sm font-medium hover:text-yellow-600">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}