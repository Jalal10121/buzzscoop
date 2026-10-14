"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@/components/admin/BarChart";

interface Analytics {
  totalViews: number;
  todayViews: number;
  realtime: number;
  avgPerDay: number;
  articlesTracked: number;
  rpm: number;
  totalRevenue: number;
  todayRevenue: number;
  ctr: number;
  avgSessionDuration: number;
  bounceRate: number;
  monthlyProjection: number;
  yearlyProjection: number;
  topArticles: { slug: string; count: number; revenue: number }[];
  dailyViews: { date: string; count: number; revenue: number }[];
  trafficSources: { source: string; count: number; percentage: number; revenue: number }[];
  deviceBreakdown: { mobile: number; desktop: number; tablet: number };
  topCountries: { country: string; count: number; revenue: number }[];
  peakDay: { date: string; count: number; revenue: number };
}

export default function AnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"views" | "revenue">("views");

  async function load() {
    try {
      const res = await fetch("/api/admin/analytics");
      if (!res.ok) {
        console.error("Analytics API failed:", res.status, res.statusText);
        return;
      }
      const json = await res.json();
      setData(json);
      setLastUpdate(new Date());
    } catch {}
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  function exportCSV() {
    if (!data) return;
    const rows = [
      ["=== STATS ==="],
      ["Total Views", String(data.totalViews)],
      ["Today Views", String(data.todayViews)],
      ["RPM", "$" + data.rpm.toFixed(2)],
      ["Total Revenue", "$" + data.totalRevenue.toFixed(2)],
      ["Today Revenue", "$" + data.todayRevenue.toFixed(2)],
      ["CTR", data.ctr.toFixed(2) + "%"],
      ["Bounce Rate", data.bounceRate.toFixed(1) + "%"],
      ["Avg Session", Math.round(data.avgSessionDuration) + "s"],
      [],
      ["=== DAILY ==="],
      ["Date", "Views", "Revenue"],
      ...data.dailyViews.map((d) => [d.date, String(d.count), "$" + d.revenue.toFixed(2)]),
      [],
      ["=== TOP ARTICLES ==="],
      ["Article", "Views", "Revenue"],
      ...data.topArticles.map((a) => [a.slug, String(a.count), "$" + a.revenue.toFixed(2)]),
      [],
      ["=== SOURCES ==="],
      ["Source", "Count", "%", "Revenue"],
      ...data.trafficSources.map((s) => [s.source, String(s.count), s.percentage + "%", "$" + s.revenue.toFixed(2)]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  }

  if (loading) return <p className="text-gray-400 p-4">Loading analytics...</p>;
  if (!data) return <p className="text-red-400 p-4">Failed to load.</p>;

  const deviceTotal = (data.deviceBreakdown?.mobile || 0) + (data.deviceBreakdown?.desktop || 0) + (data.deviceBreakdown?.tablet || 0) || 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black dark:text-white">Analytics & Revenue</h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh every 30s
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={load}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white font-bold px-4 py-2 rounded-lg text-sm cursor-pointer transition"
          >
            Refresh
          </button>
          <button
            onClick={exportCSV}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm cursor-pointer transition"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* REVENUE HERO CARD */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-2xl p-6 sm:p-8 mb-6 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-green-100 text-xs uppercase tracking-wider font-bold mb-1">
              Total Revenue (30 days)
            </p>
            <p className="text-4xl sm:text-5xl font-black">
              ${data.totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-100 text-xs uppercase tracking-wider font-bold mb-1">
              RPM
            </p>
            <p className="text-3xl font-black">${data.rpm.toFixed(2)}</p>
            <p className="text-green-100 text-xs">per 1K views</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-green-400/30">
          <div>
            <p className="text-green-100 text-xs mb-1">Today</p>
            <p className="text-xl font-black">${data.todayRevenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-green-100 text-xs mb-1">Monthly Est.</p>
            <p className="text-xl font-black">${data.monthlyProjection.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-green-100 text-xs mb-1">Yearly Est.</p>
            <p className="text-xl font-black">${data.yearlyProjection.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-green-100 text-xs mb-1">CTR</p>
            <p className="text-xl font-black">{data.ctr.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* STATS GRID — 5 cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard icon="👁️" label="Total Views" value={data.totalViews.toLocaleString()} />
        <StatCard icon="🔥" label="Today" value={data.todayViews.toLocaleString()} accent="text-yellow-600 dark:text-yellow-400" />
        <StatCard icon="🟢" label="Real-time" value={data.realtime.toLocaleString()} accent="text-green-600 dark:text-green-400" pulse />
        <StatCard icon="📊" label="Avg / Day" value={data.avgPerDay.toLocaleString()} />
        <StatCard icon="⏱️" label="Avg Session" value={Math.round(data.avgSessionDuration) + "s"} />
      </div>

      {/* CHART with view/revenue toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="font-black text-lg dark:text-white">
            📊 Last 14 Days — {viewMode === "views" ? "Views" : "Revenue"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("views")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                viewMode === "views" ? "bg-yellow-400 text-black" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              👁️ Views
            </button>
            <button
              onClick={() => setViewMode("revenue")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition ${
                viewMode === "revenue" ? "bg-yellow-400 text-black" : "bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              💰 Revenue
            </button>
          </div>
        </div>

        {data.dailyViews.some((d) => d.count > 0) ? (
          <BarChart
            data={data.dailyViews.map((d) => ({
              date: d.date,
              count: viewMode === "views" ? d.count : Math.round(d.revenue * 100),
            }))}
            height={200}
          />
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            No data yet. Deploy your site to start collecting analytics.
          </div>
        )}
      </div>

      {/* 2-column grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-black text-lg mb-4 dark:text-white">🌐 Traffic Sources</h2>
          {data.trafficSources.length === 0 ? (
            <p className="text-gray-400 text-sm">No traffic yet.</p>
          ) : (
            <div className="space-y-3">
              {data.trafficSources.map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium dark:text-gray-200">{s.source}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">
                      {s.count} ({s.percentage}%) • <strong className="text-green-600">${s.revenue.toFixed(2)}</strong>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-black text-lg mb-4 dark:text-white">📱 Devices</h2>
          <div className="space-y-3">
            {[
              { icon: "📱", label: "Mobile", value: data.deviceBreakdown.mobile },
              { icon: "💻", label: "Desktop", value: data.deviceBreakdown.desktop },
              { icon: "📟", label: "Tablet", value: data.deviceBreakdown.tablet },
            ].map((d) => {
              const pct = Math.round((d.value / deviceTotal) * 100);
              return (
                <div key={d.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium dark:text-gray-200">
                      {d.icon} {d.label}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {d.value} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engagement */}
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="font-bold text-sm mb-3 dark:text-white">📊 Engagement</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Bounce Rate</span>
                <span className={`font-bold ${data.bounceRate > 70 ? "text-red-500" : data.bounceRate > 40 ? "text-yellow-500" : "text-green-500"}`}>
                  {data.bounceRate.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Avg Session</span>
                <span className="font-bold dark:text-white">{Math.round(data.avgSessionDuration)}s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Articles with Revenue */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="font-black text-lg mb-4 dark:text-white">🏆 Top Earning Articles</h2>
        {data.topArticles.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet.</p>
        ) : (
          <ol className="space-y-2">
            {data.topArticles.map((a, i) => (
              <li
                key={a.slug}
                className="flex items-center gap-3 text-sm py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center font-black text-black text-xs flex-shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 font-medium truncate dark:text-gray-200">{a.slug}</span>
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {a.count} views
                </span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  ${a.revenue.toFixed(2)}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Top Countries */}
      {data.topCountries.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="font-black text-lg mb-4 dark:text-white">🌍 Top Countries</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {data.topCountries.map((c) => (
              <div key={c.country} className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  {c.country}
                </div>
                <div className="text-lg font-black dark:text-white">{c.count}</div>
                <div className="text-xs text-green-600 dark:text-green-400 font-bold">
                  ${c.revenue.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent = "text-gray-900 dark:text-white",
  pulse = false,
}: {
  icon: string;
  label: string;
  value: string;
  accent?: string;
  pulse?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        {pulse && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
      </div>
      <div className={`text-2xl sm:text-3xl font-black ${accent}`}>{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</div>
    </div>
  );
}