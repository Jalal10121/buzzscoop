import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const DATA_DIR = path.join(process.cwd(), "data");
const ANALYTICS_FILE = "analytics.json";

interface View {
  slug: string;
  timestamp: string;
  referrer?: string;
  country?: string;
  device?: "mobile" | "desktop" | "tablet";
  userAgent?: string;
  sessionDuration?: number;
  adClicks?: number;
  adImpressions?: number;
}

function readAnalytics(): View[] {
  try {
    const p = path.join(DATA_DIR, ANALYTICS_FILE);
    if (!fs.existsSync(p)) return [];
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return [];
  }
}

function writeAnalytics(data: View[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(path.join(DATA_DIR, ANALYTICS_FILE), JSON.stringify(data, null, 2));
}

function detectDevice(ua: string): "mobile" | "desktop" | "tablet" {
  if (!ua) return "desktop";
  const lower = ua.toLowerCase();
  if (lower.includes("tablet") || lower.includes("ipad")) return "tablet";
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("iphone")) return "mobile";
  return "desktop";
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const views = readAnalytics();
  const now = Date.now();
  const last30 = views.filter((v) => new Date(v.timestamp).getTime() > now - 30 * 24 * 60 * 60 * 1000);
  const today = new Date().toISOString().split("T")[0];
  const todayViews = views.filter((v) => v.timestamp.startsWith(today));

  const totalViews = last30.length;

  // ===== REVENUE CALCULATION =====
  // Average AdSense RPM for entertainment/news: $3-$15 per 1000 views
  // Default RPM: $5 (can be changed in settings)
  const DEFAULT_RPM = 5.0;
  const rpm = DEFAULT_RPM;

  const totalRevenue = (totalViews / 1000) * rpm;
  const todayRevenue = (todayViews.length / 1000) * rpm;

  // Estimated CTR (Click-Through Rate)
  const totalImpressions = last30.reduce((sum, v) => sum + (v.adImpressions || 0), 0) || totalViews * 2;
  const totalClicks = last30.reduce((sum, v) => sum + (v.adClicks || 0), 0) || Math.round(totalViews * 0.02);
  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  // Average Session Duration
  const totalSessionDuration = last30.reduce((sum, v) => sum + (v.sessionDuration || 0), 0);
  const avgSessionDuration = totalViews > 0 ? totalSessionDuration / totalViews : 0;

  // Bounce Rate (sessions < 10 seconds)
  const bounced = last30.filter((v) => (v.sessionDuration || 0) < 10).length;
  const bounceRate = totalViews > 0 ? (bounced / totalViews) * 100 : 0;

  // ===== TOP ARTICLES =====
  const bySlug = new Map<string, { count: number; revenue: number }>();
  last30.forEach((v) => {
    const existing = bySlug.get(v.slug) || { count: 0, revenue: 0 };
    existing.count++;
    existing.revenue = (existing.count / 1000) * rpm;
    bySlug.set(v.slug, existing);
  });
  const topArticles = Array.from(bySlug.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10)
    .map(([slug, data]) => ({ slug, count: data.count, revenue: data.revenue }));

  // ===== DAILY VIEWS + REVENUE =====
  const dailyViews: { date: string; count: number; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().split("T")[0];
    const count = last30.filter((v) => v.timestamp.startsWith(date)).length;
    dailyViews.push({
      date,
      count,
      revenue: (count / 1000) * rpm,
    });
  }

  // ===== TRAFFIC SOURCES =====
  const byReferrer = new Map<string, number>();
  last30.forEach((v) => {
    let source = "Direct";
    const ref = (v.referrer || "").toLowerCase();
    if (ref.includes("google")) source = "Google";
    else if (ref.includes("facebook")) source = "Facebook";
    else if (ref.includes("twitter") || ref.includes("x.com")) source = "Twitter / X";
    else if (ref.includes("reddit")) source = "Reddit";
    else if (ref.includes("whatsapp")) source = "WhatsApp";
    else if (ref && ref !== "") source = "Other";
    byReferrer.set(source, (byReferrer.get(source) || 0) + 1);
  });
  const trafficSources = Array.from(byReferrer.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalViews ? Math.round((count / totalViews) * 100) : 0,
      revenue: (count / 1000) * rpm,
    }));

  // ===== DEVICE BREAKDOWN =====
  const byDevice = { mobile: 0, desktop: 0, tablet: 0 };
  last30.forEach((v) => {
    const device = v.device || detectDevice(v.userAgent || "");
    byDevice[device]++;
  });

  // ===== TOP COUNTRIES =====
  const byCountry = new Map<string, number>();
  last30.forEach((v) => {
    const country = v.country || "Unknown";
    byCountry.set(country, (byCountry.get(country) || 0) + 1);
  });
  const topCountries = Array.from(byCountry.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({
      country,
      count,
      revenue: (count / 1000) * rpm,
    }));

  // ===== REAL-TIME =====
  const realtime = views.filter((v) => new Date(v.timestamp).getTime() > now - 5 * 60 * 1000).length;

  // ===== PROJECTIONS =====
  const dailyAverage = totalViews / 30;
  const monthlyProjection = dailyAverage * 30 * (rpm / 1000);
  const yearlyProjection = dailyAverage * 365 * (rpm / 1000);

  return NextResponse.json({
    // Stats
    totalViews,
    todayViews: todayViews.length,
    realtime,
    avgPerDay: Math.round(dailyAverage),
    articlesTracked: bySlug.size,

    // Revenue
    rpm,
    totalRevenue,
    todayRevenue,
    ctr,
    avgSessionDuration,
    bounceRate,
    monthlyProjection,
    yearlyProjection,

    // Data
    topArticles,
    dailyViews,
    trafficSources,
    deviceBreakdown: byDevice,
    topCountries,
    peakDay: dailyViews.reduce((max, d) => (d.count > max.count ? d : max), { date: "", count: 0, revenue: 0 }),
  });
}

export async function POST(req: NextRequest) {
  const { slug, referrer, sessionDuration } = await req.json();
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const ua = req.headers.get("user-agent") || "";
  const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "Unknown";

  const views = readAnalytics();
  views.push({
    slug,
    timestamp: new Date().toISOString(),
    referrer: referrer || "",
    country,
    device: detectDevice(ua),
    userAgent: ua,
    sessionDuration: sessionDuration || 0,
  });

  writeAnalytics(views.slice(-50000));
  return NextResponse.json({ success: true });
}