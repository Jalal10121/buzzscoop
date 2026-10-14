"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATS = ["Netflix", "Hollywood", "Marvel", "Music", "Streaming", "TV", "Awards", "Celebrity"];
const TYPES = [
  { v: "general", l: "📝 General" },
  { v: "breaking", l: "🔴 Breaking" },
  { v: "leaked", l: "🔥 Leaked" },
  { v: "confirmed", l: "✅ Confirmed" },
  { v: "listicle", l: "📋 Top 10" },
  { v: "review", l: "⭐ Review" },
  { v: "everything", l: "📖 Everything" },
];

export default function AIWriter() {
  const router = useRouter();
  const [form, setForm] = useState({ topic: "", keyword: "", category: "Netflix", type: "general", wordCount: 900 });
  const [article, setArticle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    if (!form.topic || !form.keyword) return setError("Topic and keyword required");
    setLoading(true); setError(""); setArticle("");
    try {
      const res = await fetch("/api/admin/ai-writer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (data.article) setArticle(data.article);
      else setError(data.error || "Failed");
    } catch (err) { setError(String(err)); }
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(article);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  }

  async function publish() {
    const m = article.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) return alert("Invalid format");
    const fm: any = {};
    m[1].split("\n").forEach(l => { const [k, ...v] = l.split(":"); if (k && v.length) fm[k.trim()] = v.join(":").trim().replace(/^"|"$/g, ""); });
    const res = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: fm.title, description: fm.description, content: m[2], category: fm.category || form.category, author: "BuzzScoop Team", date: fm.date || new Date().toISOString().split("T")[0], tags: [form.category.toLowerCase()] }) });
    if (res.ok) router.push("/panel-24e075625579/articles");
    else alert("Publish failed");
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">✨ AI Writer</h1>
      <p className="text-gray-500 text-sm mb-8">Generate human-like articles in 30 seconds</p>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Topic *" className="w-full px-3 py-2 border rounded-lg text-sm" />
            <input value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} placeholder="Keyword *" className="w-full px-3 py-2 border rounded-lg text-sm" />
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              {TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
            <select value={form.wordCount} onChange={e => setForm({ ...form, wordCount: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value={600}>600 words</option>
              <option value={900}>900 words</option>
              <option value={1200}>1200 words</option>
            </select>
            <button onClick={generate} disabled={loading} className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-black py-3 rounded-lg">
              {loading ? "✨ AI Writing..." : "✨ Generate"}
            </button>
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">{error}</div>}
          </div>
        </div>
        <div className="lg:col-span-2">
          {article ? (
            <div className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <button onClick={copy} className="bg-gray-100 hover:bg-gray-200 font-bold px-4 py-2 rounded-lg text-sm">{copied ? "✅ Copied!" : "📋 Copy"}</button>
                <button onClick={publish} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm">🚀 Publish</button>
                <button onClick={generate} className="text-sm text-gray-500 hover:text-yellow-600 ml-auto">🔄 Regenerate</button>
              </div>
              <div className="bg-white rounded-xl border p-6 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">{article}</pre>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border p-16 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="font-black text-xl mb-2">Ready to write</h2>
              <p className="text-gray-500 text-sm">Fill form → Generate → Publish</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}