"use client";
import { useEffect, useState } from "react";

export default function Backend() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/backend-test").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <p className="text-gray-400 p-4">Loading...</p>;

  const ok = data.isGitHub || data.environment === "development";

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">🚀 Backend</h1>
      <div className={`rounded-xl border-2 p-6 mb-6 ${ok ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{ok ? "✅" : "⚠️"}</span>
          <div>
            <h2 className="text-xl font-black">{data.backendType}</h2>
            <p className="text-sm text-gray-600">{data.isGitHub ? "Articles save to GitHub" : "Articles save locally"}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { l: "Backend Type", v: data.backendType },
            { l: "Environment", v: data.environment },
            { l: "Articles Stored", v: data.articleCount },
            { l: "GitHub Configured", v: data.githubConfigured ? "✅ Yes" : "❌ No" },
          ].map(s => (
            <div key={s.l} className="bg-white rounded-lg p-4">
              <p className="text-xs text-gray-500">{s.l}</p>
              <p className="font-bold">{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}