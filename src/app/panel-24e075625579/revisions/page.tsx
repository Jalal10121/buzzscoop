"use client";
import { useEffect, useState } from "react";

export default function Revisions() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selected, setSelected] = useState("");
  const [revisions, setRevisions] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/articles").then(r => r.json()).then(d => setArticles(Array.isArray(d) ? d : []));
  }, []);

  async function loadRevisions(id: string) {
    setSelected(id);
    const res = await fetch(`/api/admin/revisions?id=${id}`);
    const data = await res.json();
    setRevisions(Array.isArray(data) ? data : []);
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">📜 Revisions</h1>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <label className="block text-sm font-bold mb-2">Select Article</label>
        <select value={selected} onChange={e => loadRevisions(e.target.value)} className="w-full max-w-md px-4 py-2 border rounded-lg">
          <option value="">-- Choose --</option>
          {articles.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>

      {selected && (
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-4">Revisions ({revisions.length})</h2>
          {revisions.length === 0 ? <p className="text-gray-400 text-sm">No revisions.</p> :
            <ul className="space-y-2">
              {revisions.map((r, i) => (
                <li key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                  <span className="text-xs font-bold text-gray-500 w-8">#{i + 1}</span>
                  <span className="text-sm flex-1">{new Date(r.updatedAt).toLocaleString()}</span>
                  <button onClick={() => setPreview(r)} className="text-xs text-blue-600">Preview</button>
                </li>
              ))}
            </ul>}
        </div>
      )}

      {preview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Version from {new Date(preview.updatedAt).toLocaleString()}</h3>
              <button onClick={() => setPreview(null)} className="text-gray-400">✕</button>
            </div>
            <pre className="whitespace-pre-wrap text-sm">{preview.content}</pre>
          </div>
        </div>
      )}
    </div>
  );
}