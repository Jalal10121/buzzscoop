"use client";
import { useEffect, useState } from "react";

export default function Security() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/security").then(r => r.json()).then(setData).catch(() => {});
  }, []);

  if (!data) return <p className="text-gray-400 p-4">Loading...</p>;

  const stats = [
    { l: "Total Events", v: data.stats?.totalEvents || 0, i: "📊" },
    { l: "Failed Logins", v: data.stats?.failedLogins || 0, i: "🚫" },
    { l: "Rate Limited", v: data.stats?.rateLimited || 0, i: "⏱️" },
    { l: "Successful Logins", v: data.stats?.successfulLogins || 0, i: "✅" },
    { l: "Blacklisted IPs", v: data.stats?.blacklistedIPs || 0, i: "🛡️" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black mb-2">🛡 Security</h1>
      <p className="text-gray-500 text-sm mb-8">Security monitoring & audit logs</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
        {stats.map(s => (
          <div key={s.l} className="bg-white rounded-xl border p-4">
            <div className="text-2xl mb-1">{s.i}</div>
            <div className="text-2xl font-black">{s.v}</div>
            <div className="text-xs text-gray-500 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-black text-lg mb-4">📋 Recent Activity</h2>
          {(data.logs || []).length === 0 ? <p className="text-gray-400 text-sm">No logs.</p> : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {data.logs.slice(0, 30).map((log: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 border rounded text-xs">
                  <span className={`w-2 h-2 rounded-full ${log.success ? "bg-green-500" : "bg-red-500"}`} />
                  <span className="font-mono flex-1 truncate">{log.action}</span>
                  {log.user && <span className="text-gray-500">{log.user}</span>}
                  <span className="text-gray-400 text-[10px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-black text-lg mb-4">🚫 Blacklisted IPs</h2>
          {(data.blacklist || []).length === 0 ? <p className="text-gray-400 text-sm">No IPs blacklisted. Good! ✅</p> : (
            <div className="space-y-2">
              {data.blacklist.map((b: any, i: number) => (
                <div key={i} className="flex items-center gap-3 p-2 border rounded text-xs">
                  <span className="font-mono flex-1">{b.ip}</span>
                  <span className="text-gray-500">{b.reason}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}