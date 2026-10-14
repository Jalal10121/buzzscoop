"use client";
import { useEffect, useState } from "react";

const CATS = ["Netflix", "Hollywood", "Marvel", "Music", "Streaming", "TV", "Awards", "Celebrity"];

interface Trend {
  id: string;
  topic: string;
  keyword: string;
  category: string;
  source: string;
  addedAt: string;
  status: string;
}

export default function Trends() {
  const [data, setData] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ topic: "", keyword: "", category: "Netflix" });
  const [bulkText, setBulkText] = useState("");
  const [bulkCategory, setBulkCategory] = useState("Netflix");
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  async function load() {
    const res = await fetch("/api/admin/trends");
    setData(await res.json());
  }
  useEffect(() => { load(); }, []);

  // ---- Add single trend ----
  async function add() {
    if (!form.topic || !form.keyword) return;
    await fetch("/api/admin/trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", ...form, source: "manual", country: "US" }),
    });
    setForm({ topic: "", keyword: "", category: "Netflix" });
    setShowForm(false);
    load();
  }

  // ---- Bulk import ----
  async function bulkImport() {
    const lines = bulkText.split("\n").filter(l => l.trim());
    if (lines.length === 0) return;

    for (const line of lines) {
      const topic = line.trim();
      if (!topic) continue;
      const keyword = topic.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
      await fetch("/api/admin/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add",
          topic,
          keyword,
          category: bulkCategory,
          source: "bulk-import",
          country: "US",
        }),
      });
    }
    setBulkText("");
    setShowBulk(false);
    load();
    alert(`✅ ${lines.length} trends imported!`);
  }

  // ---- Edit trend ----
  async function saveEdit() {
    if (!editId || !form.topic || !form.keyword) return;
    await fetch("/api/admin/trends", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "edit", id: editId, topic: form.topic, keyword: form.keyword, category: form.category }),
    });
    setEditId(null);
    setForm({ topic: "", keyword: "", category: "Netflix" });
    setShowForm(false);
    load();
  }

  function startEdit(t: Trend) {
    setEditId(t.id);
    setForm({ topic: t.topic, keyword: t.keyword, category: t.category });
    setShowForm(true);
  }

  async function skip(id: string) {
    await fetch("/api/admin/trends", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "skip", id }) });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Remove?")) return;
    await fetch("/api/admin/trends", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "remove", id }) });
    load();
  }

  if (!data) return <p className="text-gray-400 p-4">Loading...</p>;

  // Filter + Search
  const allTrends: Trend[] = data.trends || [];
  const filtered = allTrends.filter(t => {
    if (t.status !== "new") return false;
    if (filterCat !== "all" && t.category !== filterCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!t.topic.toLowerCase().includes(q) && !t.keyword.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black">📈 Trends Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Manual workflow — 5 minutes daily</p>
      </div>

      {/* Quick Links */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
        <h2 className="font-black text-blue-900 mb-3">🔗 Quick Links</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { u: "https://trends.google.com/trending?geo=US&hours=24", l: "📈 Google Trends US" },
            { u: "https://trends.google.com/trending?geo=US&hours=24&category=3", l: "🎬 Entertainment" },
            { u: "https://www.netflix.com/tudum", l: "🎥 Netflix Tudum" },
            { u: "https://www.whats-on-netflix.com/", l: "📺 What's on Netflix" },
            { u: "https://twitter.com/search?q=netflix&f=live", l: "🐦 Twitter Live" },
            { u: "https://www.reddit.com/r/netflix/", l: "💬 Reddit r/Netflix" },
          ].map(x => (
            <a key={x.u} href={x.u} target="_blank" rel="noopener noreferrer" className="block p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 text-sm font-bold text-blue-700">{x.l} →</a>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ topic: "", keyword: "", category: "Netflix" }); }}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-lg"
        >
          {showForm && !editId ? "✕ Cancel" : "➕ Add Trend"}
        </button>
        <button
          onClick={() => { setShowBulk(!showBulk); setShowForm(false); setEditId(null); }}
          className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-5 py-2.5 rounded-lg"
        >
          {showBulk ? "✕ Cancel" : "📋 Bulk Import (10+)"}
        </button>
        {filtered.length > 0 && (
          <span className="flex items-center text-xs text-gray-500 px-3">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border-2 border-yellow-300 p-6 mb-6 space-y-3">
          <h2 className="font-black text-lg">{editId ? "✏️ Edit Trend" : "➕ Add New Trend"}</h2>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Topic *</label>
            <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g., Netflix Wednesday Season 3 Confirmed" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Keyword *</label>
            <input value={form.keyword} onChange={e => setForm({ ...form, keyword: e.target.value })} placeholder="e.g., netflix wednesday season 3" className="w-full px-4 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={editId ? saveEdit : add} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2 rounded-lg">
              {editId ? "💾 Save Changes" : "➕ Add Trend"}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setShowForm(false); setForm({ topic: "", keyword: "", category: "Netflix" }); }} className="text-gray-500 px-4">
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bulk Import Form */}
      {showBulk && (
        <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-6 mb-6 space-y-3">
          <h2 className="font-black text-lg text-purple-900">📋 Bulk Import</h2>
          <p className="text-xs text-purple-700">Paste topics line by line. Each line = 1 trend.</p>
          <select value={bulkCategory} onChange={e => setBulkCategory(e.target.value)} className="w-full px-4 py-2 border rounded-lg">
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <textarea
            value={bulkText}
            onChange={e => setBulkText(e.target.value)}
            rows={8}
            placeholder={`Netflix Wednesday Season 3 Confirmed\nNetflix Dark Season 5 Release Date\nTaylor Swift New Album 2026\nMarvel Phase 6 Full Breakdown\nStranger Things Spin-off Cast\n...`}
            className="w-full px-4 py-2 border rounded-lg font-mono text-sm"
          />
          <p className="text-xs text-purple-700">
            <strong>{bulkText.split("\n").filter(l => l.trim()).length}</strong> trends ready to import
          </p>
          <div className="flex gap-2">
            <button onClick={bulkImport} disabled={bulkText.trim().length === 0} className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-5 py-2 rounded-lg">
              📥 Import All
            </button>
            <button onClick={() => { setShowBulk(false); setBulkText(""); }} className="text-gray-500 px-4">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-white rounded-xl border p-4 mb-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">🔍 Search</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search trends by topic or keyword..."
              className="w-full px-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">📁 Category</label>
            <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-sm">
              <option value="all">All Categories ({allTrends.filter(t => t.status === "new").length})</option>
              {CATS.map(c => (
                <option key={c} value={c}>{c} ({allTrends.filter(t => t.status === "new" && t.category === c).length})</option>
              ))}
            </select>
          </div>
        </div>
        {(search || filterCat !== "all") && (
          <button onClick={() => { setSearch(""); setFilterCat("all"); }} className="mt-3 text-xs text-blue-600 hover:underline">
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { l: "Total", v: data.stats?.total || 0, c: "" },
          { l: "New", v: data.stats?.new || 0, c: "text-yellow-600" },
          { l: "Used", v: data.stats?.used || 0, c: "text-green-600" },
          { l: "Skipped", v: data.stats?.skipped || 0, c: "text-gray-400" },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-xl border p-4">
            <div className="text-xs text-gray-500">{s.l}</div>
            <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Trends List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-16 text-center">
          <div className="text-6xl mb-4">📈</div>
          <p className="text-gray-500 mb-4">
            {search || filterCat !== "all" ? "No trends match your filters." : "No new trends."}
          </p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => setShowForm(true)} className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg">➕ Add First Trend</button>
            <button onClick={() => setShowBulk(true)} className="bg-purple-500 text-white font-bold px-6 py-3 rounded-lg">📋 Bulk Import</button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-xl border p-5 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">{t.category}</span>
                {t.source && t.source !== "manual" && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded ml-2">{t.source}</span>
                )}
                <h3 className="font-black text-lg mt-2">{t.topic}</h3>
                <p className="text-sm text-gray-500">Keyword: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{t.keyword}</code></p>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a href={"/panel-24e075625579/ai-writer?topic=" + encodeURIComponent(t.topic) + "&keyword=" + encodeURIComponent(t.keyword) + "&category=" + t.category} className="bg-yellow-400 hover:bg-yellow-500 text-black text-xs font-bold px-3 py-1.5 rounded text-center">✨ Write</a>
                <button onClick={() => startEdit(t)} className="text-blue-600 text-xs hover:underline">✏️ Edit</button>
                <button onClick={() => skip(t.id)} className="text-gray-500 text-xs">Skip</button>
                <button onClick={() => remove(t.id)} className="text-red-500 text-xs">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}