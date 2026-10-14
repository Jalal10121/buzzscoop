"use client";
import { useEffect, useState } from "react";

export default function Categories() {
  const [cats, setCats] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories").then(r => r.json()).then(d => setCats(Array.isArray(d) ? d : []));
  }, []);

  async function save(updated: string[]) {
    setSaving(true);
    await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categories: updated }) });
    setCats(updated);
    setSaving(false);
  }

  function add() {
    if (!newCat.trim()) return;
    if (cats.includes(newCat.trim())) return alert("Already exists");
    save([...cats, newCat.trim()]);
    setNewCat("");
  }

  function remove(c: string) {
    if (!confirm(`Delete "${c}"?`)) return;
    save(cats.filter(x => x !== c));
  }

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">📁 Categories</h1>
      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex gap-2">
          <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="New category name" className="flex-1 px-4 py-2 border rounded-lg" />
          <button onClick={add} disabled={saving} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg">➕ Add</button>
        </div>
      </div>
      {cats.length === 0 ? <p className="text-center text-gray-400 py-16">No categories yet.</p> : (
        <div className="bg-white rounded-xl border divide-y">
          {cats.map(c => (
            <div key={c} className="flex items-center justify-between p-4">
              <span className="font-medium">{c}</span>
              <button onClick={() => remove(c)} className="text-red-600 hover:underline text-sm">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}