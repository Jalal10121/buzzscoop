"use client";
import { useEffect, useState, useRef } from "react";

export default function Media() {
  const [files, setFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const res = await fetch("/api/admin/media");
    const data = await res.json();
    setFiles(Array.isArray(data) ? data : []);
  }
  useEffect(() => { load(); }, []);

  async function upload(list: FileList) {
    setUploading(true);
    for (const file of Array.from(list)) {
      const fd = new FormData();
      fd.append("file", file);
      await fetch("/api/admin/upload", { method: "POST", body: fd });
    }
    setUploading(false);
    load();
  }

  async function del(name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    await fetch(`/api/admin/media?name=${name}`, { method: "DELETE" });
    load();
  }

  function copy(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h1 className="text-3xl font-black">🖼 Media Library</h1>
        <button onClick={() => inputRef.current?.click()} disabled={uploading} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-5 py-2.5 rounded-lg">
          {uploading ? "Uploading..." : "⬆️ Upload Images"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => e.target.files && upload(e.target.files)} />
      </div>

      <div
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); e.dataTransfer.files && upload(e.dataTransfer.files); }}
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center mb-6"
      >
        <div className="text-4xl mb-2">📁</div>
        <p className="text-gray-500 text-sm">Drag & drop images here</p>
      </div>

      {files.length === 0 ? (
        <p className="text-center text-gray-400 py-16">No images yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {files.map(f => (
            <div key={f.name} className="bg-white rounded-lg border overflow-hidden">
              <div className="relative aspect-square bg-gray-100">
                <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 truncate mb-2">{f.name}</p>
                <div className="flex gap-2">
                  <button onClick={() => copy(f.url)} className="flex-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1.5 rounded">
                    {copied === f.url ? "✅" : "Copy URL"}
                  </button>
                  <button onClick={() => del(f.name)} className="text-xs text-red-600 px-2 py-1.5 rounded">🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}