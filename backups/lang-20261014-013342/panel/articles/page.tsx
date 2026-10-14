"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/articles");
    const data = await res.json();
    setArticles(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function del(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-black">Articles</h1>
        <Link href="/panel-24e075625579/articles/new" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-lg">➕ New Article</Link>
      </div>
      {loading ? <p className="text-gray-400">Loading...</p> :
       articles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500 mb-4">No articles yet.</p>
          <Link href="/panel-24e075625579/articles/new" className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg">Write First Article</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-bold">Title</th>
                <th className="text-left p-3 font-bold hidden sm:table-cell">Category</th>
                <th className="text-right p-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{a.title}</td>
                  <td className="p-3 hidden sm:table-cell"><span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{a.category}</span></td>
                  <td className="p-3 text-right space-x-2">
                    <Link href={`/blog/${a.slug}`} target="_blank" className="text-blue-600 hover:underline text-xs">View</Link>
                    <button onClick={() => del(a.id, a.title)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}