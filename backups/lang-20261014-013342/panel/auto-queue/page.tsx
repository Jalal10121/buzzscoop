"use client";
import { useEffect, useState } from "react";

interface Draft { id: string; title: string; description: string; content: string; category: string; status: string; createdAt: string; }
const CATS = ["Netflix", "Hollywood", "Marvel", "Music", "Streaming", "TV", "Awards", "Celebrity"];

export default function AutoQueue() {
  const [data, setData] = useState<any>(null);
  const [scraping, setScraping] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<"pending"|"approved"|"rejected">("pending");
  const [showManual, setShowManual] = useState(false);
  const [preview, setPreview] = useState<Draft|null>(null);
  const [manual, setManual] = useState({ topic: "", keyword: "", category: "Netflix", description: "" });

  async function load() {
    const res = await fetch("/api/admin/queue");
    setData(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function scrape() {
    setScraping(true); setMsg("");
    try {
      const res = await fetch("/api/admin/scrape-tudum", { method: "POST" });
      const r = await res.json();
      if (r.error) setMsg("❌ " + r.error);
      else if (r.scraped === 0) { setMsg("⚠️ No items"); setShowManual(true); }
      else setMsg(`✅ ${r.generated} drafts generated`);
      load();
    } catch (err) { setMsg("❌ " + String(err)); }
    setScraping(false);
  }

  async function addManual() {
    if (!manual.topic) return setMsg("❌ Topic required");
    setGenerating(true); setMsg("✨ Generating...");
    try {
      const res = await fetch("/api/admin/add-topic", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(manual) });
      const r = await res.json();
      if (r.error) setMsg("❌ " + r.error);
      else if (r.success === false) setMsg("⚠️ " + r.message);
      else { setMsg(`✅ Draft: "${r.draft?.title}"`); setManual({ topic: "", keyword: "", category: "Netflix", description: "" }); setShowManual(false); }
      load();
    } catch (err) { setMsg("❌ " + String(err)); }
    setGenerating(false);
  }

  async function approve(id: string) {
    await fetch("/api/admin/queue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "approve", id }) });
    load();
  }
  async function reject(id: string) {
    await fetch("/api/admin/queue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reject", id }) });
    load();
  }

  if (!data) return <p className="text-gray-400 p-4">Loading...</p>;

  const filtered = (data.drafts || []).filter((d: Draft) => d.status === filter);

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">🤖 Auto Queue</h1>
      <p className="text-gray-500 text-sm mb-6">AI drafts articles — you review + approve</p>

      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setShowManual(!showManual)} className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-5 py-2.5 rounded-lg">
          {showManual ? "✕ Cancel" : "✏️ Add Topic Manually"}
        </button>
        <button onClick={scrape} disabled={scraping} className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg">
          {scraping ? "✨ Scraping..." : "🔄 Auto Scrape"}
        </button>
      </div>

      {msg && <div className={"p-4 rounded-lg mb-6 text-sm " + (msg.startsWith("✅") ? "bg-green-50 text-green-800 border border-green-200" : msg.startsWith("⚠️") ? "bg-yellow-50 text-yellow-800 border" : "bg-red-50 text-red-800 border")}>{msg}</div>}

      {showManual && (
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 mb-6 space-y-3">
          <input value={manual.topic} onChange={e => setManual({ ...manual, topic: e.target.value })} placeholder="Topic *" className="w-full px-3 py-2 border rounded-lg" />
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={manual.keyword} onChange={e => setManual({ ...manual, keyword: e.target.value })} placeholder="Keyword" className="w-full px-3 py-2 border rounded-lg" />
            <select value={manual.category} onChange={e => setManual({ ...manual, category: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <textarea value={manual.description} onChange={e => setManual({ ...manual, description: e.target.value })} rows={2} placeholder="Description" className="w-full px-3 py-2 border rounded-lg" />
          <button onClick={addManual} disabled={generating} className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg">
            {generating ? "✨ Generating..." : "✨ Generate Draft"}
          </button>
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { l: "Total", v: data.stats?.total || 0, c: "" },
          { l: "Pending", v: data.stats?.pending || 0, c: "text-yellow-600" },
          { l: "Approved", v: data.stats?.approved || 0, c: "text-green-600" },
          { l: "Rejected", v: data.stats?.rejected || 0, c: "text-red-600" },
        ].map(s => (
          <div key={s.l} className="bg-white rounded-xl border p-4">
            <div className="text-xs text-gray-500">{s.l}</div>
            <div className={`text-2xl font-black ${s.c}`}>{s.v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        {(["pending", "approved", "rejected"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${filter === f ? "bg-yellow-400 text-black" : "bg-white border"}`}>
            {f} ({(data.drafts || []).filter((d: Draft) => d.status === f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border p-16 text-center">
          <div className="text-6xl mb-4">🤖</div>
          <p className="text-gray-500 mb-4">No {filter} drafts.</p>
          <button onClick={() => setShowManual(true)} className="bg-purple-500 text-white font-bold px-6 py-3 rounded-lg">✏️ Add First Topic</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d: Draft) => (
            <div key={d.id} className="bg-white rounded-xl border p-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold">{d.category}</span>
                  <h3 className="font-black text-lg mt-2 mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{d.description}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button onClick={() => setPreview(d)} className="text-xs text-blue-600 hover:underline">👁 Preview</button>
                  {d.status === "pending" && (
                    <>
                      <button onClick={() => approve(d.id)} className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded">✅ Approve</button>
                      <button onClick={() => reject(d.id)} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded">❌ Reject</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-black text-lg">Preview</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400 text-xl">✕</button>
            </div>
            <div className="font-bold mb-2">{preview.title}</div>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">{preview.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}