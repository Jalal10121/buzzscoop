"use client";
import { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "writer", name: "" });

  async function load() {
    const res = await fetch("/api/admin/users");
    if (res.ok) { const d = await res.json(); setUsers(Array.isArray(d) ? d : []); }
  }
  useEffect(() => { load(); }, []);

  async function create() {
    if (!form.username || !form.password) return alert("Username and password required");
    const res = await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { setShow(false); setForm({ username: "", password: "", role: "writer", name: "" }); load(); }
    else { const d = await res.json(); alert(d.error); }
  }

  async function del(id: string, username: string) {
    if (id === "1") return alert("Cannot delete main admin");
    if (!confirm(`Delete ${username}?`)) return;
    await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">👥 Users</h1>
        <button onClick={() => setShow(!show)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-lg">{show ? "Cancel" : "➕ New User"}</button>
      </div>

      {show && (
        <div className="bg-white rounded-xl border p-6 mb-6 space-y-4">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full px-4 py-2 border rounded-lg" />
          <input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username" className="w-full px-4 py-2 border rounded-lg" />
          <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" className="w-full px-4 py-2 border rounded-lg" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
            <option value="writer">Writer</option>
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={create} className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-lg">Create User</button>
        </div>
      )}

      <div className="bg-white rounded-xl border divide-y">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-bold">{u.name || u.username}</p>
              <p className="text-xs text-gray-500">@{u.username}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded font-bold ${u.role === "admin" ? "bg-red-100 text-red-800" : u.role === "editor" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>{u.role?.toUpperCase()}</span>
            <button onClick={() => del(u.id, u.username)} className="text-red-600 hover:underline text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}