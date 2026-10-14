"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [queueStats, setQueueStats] = useState({ pending: 0 });
  const [trendsStats, setTrendsStats] = useState({ new: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/articles").then(r => r.json()).catch(() => []),
      fetch("/api/admin/queue").then(r => r.json()).catch(() => ({ stats: { pending: 0 } })),
      fetch("/api/admin/trends").then(r => r.json()).catch(() => ({ stats: { new: 0 } })),
    ]).then(([a, q, t]) => {
      setArticles(Array.isArray(a) ? a : []);
      setQueueStats(q.stats || { pending: 0 });
      setTrendsStats(t.stats || { new: 0 });
    }).finally(() => setLoading(false));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const publishedToday = articles.filter(a => a.date?.startsWith(today)).length;

  const stats = [
    { l: "Total Articles", v: articles.length, i: "📝", h: "/panel-24e075625579/articles" },
    { l: "Pending Drafts", v: queueStats.pending, i: "🤖", h: "/panel-24e075625579/auto-queue" },
    { l: "New Trends", v: trendsStats.new, i: "📈", h: "/panel-24e075625579/trends" },
    { l: "Published Today", v: publishedToday, i: "🔥", h: "/panel-24e075625579/articles" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black mb-2 dark:text-white">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">Welcome to BuzzScoop Admin</p>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map(s => (
          <Link key={s.l} href={s.h} className="block p-5 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:border-yellow-400 transition">
            <div className="text-3xl mb-2">{s.i}</div>
            <div className="text-2xl font-black">{loading ? "..." : s.v}</div>
            <div className="text-xs text-gray-500 mt-1">{s.l}</div>
          </Link>
        ))}
      </div>
      <h2 className="font-black text-xl mb-4">⚡ Choose Workflow</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[
          { t: "✏️ Manual Mode", h: "/panel-24e075625579/auto-queue", c: "border-purple-300 bg-purple-50" },
          { t: "🔄 Auto Scrape", h: "/panel-24e075625579/auto-queue", c: "border-yellow-300 bg-yellow-50" },
          { t: "📈 Trends", h: "/panel-24e075625579/trends", c: "border-blue-300 bg-blue-50" },
          { t: "✨ AI Writer", h: "/panel-24e075625579/ai-writer", c: "border-green-300 bg-green-50" },
        ].map(w => (
          <Link key={w.t} href={w.h} className={`block p-5 rounded-xl border-2 ${w.c}`}>
            <h3 className="font-black">{w.t}</h3>
          </Link>
        ))}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6">
        <h2 className="font-black text-lg mb-4">📰 Recent Articles</h2>
        {loading ? <p className="text-gray-400 text-sm">Loading...</p> :
         articles.length === 0 ? <p className="text-gray-400 text-sm">No articles yet.</p> :
         <ul className="space-y-2">{articles.slice(0, 5).map(a => <li key={a.id} className="text-sm font-medium line-clamp-1">{a.title}</li>)}</ul>}
      </div>
    </div>
  );
}