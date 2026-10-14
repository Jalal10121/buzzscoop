"use client";
import { useEffect, useState } from "react";

interface Author { id: string; name: string; role: string; bio: string; avatar: string; }

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [edit, setEdit] = useState<Author | null>(null);

  useEffect(() => {
    fetch("/api/admin/authors").then(r => r.json()).then(d => setAuthors(Array.isArray(d) ? d : []));
  }, []);

  async function save(list: Author[]) {
    await fetch("/api/admin/authors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ authors: list }) });
    setAuthors(list);
    setEdit(null);
  }

  function addNew() {
    setEdit({ id: Date.now().toString(), name: "", role: "", bio: "", avatar: "" });
  }

  function saveEdit() {
    if (!edit) return;
    const exists = authors.find(a => a.id === edit.id);
    save(exists ? authors.map(a => a.id === edit.id ? edit : a) : [...authors, edit]);
  }

  function del(id: string) {
    if (!confirm("Delete?")) return;
    save(authors.filter(a => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">👤 Authors</h1>
        <button onClick={addNew} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-lg">➕ New Author</button>
      </div>

      {edit && (
        <div className="bg-white rounded-xl border p-6 mb-6 space-y-4">
          <input value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} placeholder="Name" className="w-full px-4 py-2 border rounded-lg" />
          <input value={edit.role} onChange={e => setEdit({ ...edit, role: e.target.value })} placeholder="Role" className="w-full px-4 py-2 border rounded-lg" />
          <textarea value={edit.bio} onChange={e => setEdit({ ...edit, bio: e.target.value })} placeholder="Bio" rows={3} className="w-full px-4 py-2 border rounded-lg" />
          <input value={edit.avatar} onChange={e => setEdit({ ...edit, avatar: e.target.value })} placeholder="Avatar URL" className="w-full px-4 py-2 border rounded-lg text-sm" />
          <div className="flex gap-2">
            <button onClick={saveEdit} className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg">Save</button>
            <button onClick={() => setEdit(null)} className="text-gray-500 px-4">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {authors.map(a => (
          <div key={a.id} className="bg-white rounded-xl border p-5">
            {a.avatar && <img src={a.avatar} alt={a.name} className="w-16 h-16 rounded-full object-cover mb-3" />}
            <h3 className="font-bold">{a.name}</h3>
            <p className="text-xs text-yellow-600">{a.role}</p>
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{a.bio}</p>
            <div className="flex gap-3 mt-3 text-xs">
              <button onClick={() => setEdit(a)} className="text-yellow-600 hover:underline">Edit</button>
              <button onClick={() => del(a.id)} className="text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}