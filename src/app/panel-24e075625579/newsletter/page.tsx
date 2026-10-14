"use client";
import { useEffect, useState } from "react";

export default function Newsletter() {
  const [subs, setSubs] = useState<any[]>([]);

  async function load() {
    const res = await fetch("/api/admin/newsletter");
    const data = await res.json();
    setSubs(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  function exportCSV() {
    const csv = ["Email,Subscribed At", ...subs.map(s => `${s.email},${s.subscribedAt}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${Date.now()}.csv`;
    a.click();
  }

  async function del(id: string) {
    if (!confirm("Remove subscriber?")) return;
    await fetch(`/api/admin/newsletter?id=${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">📬 Newsletter</h1>
          <p className="text-gray-500 text-sm mt-1">{subs.length} subscribers</p>
        </div>
        <button onClick={exportCSV} disabled={subs.length === 0} className="bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-bold px-5 py-2.5 rounded-lg">📥 Export CSV</button>
      </div>

      {subs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border">
          <div className="text-6xl mb-4">📬</div>
          <p className="text-gray-500">No subscribers yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-3 font-bold">Email</th>
                <th className="text-left p-3 font-bold hidden sm:table-cell">Subscribed</th>
                <th className="text-right p-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subs.map(s => (
                <tr key={s.id} className="border-b">
                  <td className="p-3">{s.email}</td>
                  <td className="p-3 text-gray-500 hidden sm:table-cell">{new Date(s.subscribedAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => del(s.id)} className="text-red-600 hover:underline text-xs">Remove</button>
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