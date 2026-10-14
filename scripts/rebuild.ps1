# ============================================================
# BUZZSCOOP - Complete Admin Rebuild
# One-Shot Professional Script
# ============================================================

$ErrorActionPreference = "Stop"
$root = "D:\buzzscoop"
Set-Location $root

$SECRET = "panel-24e075625579"
$adminPath = Join-Path $root "src\app\$SECRET"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "BUZZSCOOP ADMIN REBUILD" -ForegroundColor Yellow
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Clean
Write-Host "[1/4] Cleaning old files..." -ForegroundColor Yellow
if (Test-Path $adminPath) { Remove-Item -Recurse -Force $adminPath }
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
Write-Host "  Done" -ForegroundColor Green

# Folders
Write-Host ""
Write-Host "[2/4] Creating folders..." -ForegroundColor Yellow
$folders = @("", "\login", "\dashboard", "\articles", "\articles\new", "\ai-writer", "\auto-queue", "\trends", "\media", "\revisions", "\comments", "\analytics", "\newsletter", "\categories", "\authors", "\users", "\security", "\backend", "\settings")
foreach ($f in $folders) { New-Item -ItemType Directory -Force -Path "$adminPath$f" | Out-Null }
Write-Host "  Done ($($folders.Count) folders)" -ForegroundColor Green

# Helper function
function Write-Page {
    param([string]$RelPath, [string]$Content)
    $fullPath = Join-Path $root $RelPath
    $utf8 = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($fullPath, $Content, $utf8)
}

Write-Host ""
Write-Host "[3/4] Writing 19 pages..." -ForegroundColor Yellow

# LAYOUT
$layoutContent = @"
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const NAV = [
  { href: "/$SECRET/dashboard", label: "Dashboard", icon: "D" },
  { href: "/$SECRET/articles", label: "Articles", icon: "A" },
  { href: "/$SECRET/articles/new", label: "New Article", icon: "+" },
  { href: "/$SECRET/ai-writer", label: "AI Writer", icon: "*" },
  { href: "/$SECRET/auto-queue", label: "Auto Queue", icon: "Q" },
  { href: "/$SECRET/trends", label: "Trends", icon: "T" },
  { href: "/$SECRET/media", label: "Media", icon: "M" },
  { href: "/$SECRET/revisions", label: "Revisions", icon: "R" },
  { href: "/$SECRET/comments", label: "Comments", icon: "C" },
  { href: "/$SECRET/analytics", label: "Analytics", icon: "N" },
  { href: "/$SECRET/newsletter", label: "Newsletter", icon: "L" },
  { href: "/$SECRET/categories", label: "Categories", icon: "F" },
  { href: "/$SECRET/authors", label: "Authors", icon: "U" },
  { href: "/$SECRET/users", label: "Users", icon: "P" },
  { href: "/$SECRET/security", label: "Security", icon: "S" },
  { href: "/$SECRET/backend", label: "Backend", icon: "B" },
  { href: "/$SECRET/settings", label: "Settings", icon: "G" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (pathname.includes("/login")) return <>{children}</>;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/$SECRET/login");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {open && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)} />}

      <aside className={"fixed md:sticky top-0 left-0 z-50 w-64 h-screen bg-gray-900 text-white flex flex-col transform transition-transform duration-300 md:translate-x-0 " + (open ? "translate-x-0" : "-translate-x-full")}>
        <div className="p-5 border-b border-gray-800 flex-shrink-0">
          <Link href="/$SECRET/dashboard" className="text-xl font-black block">
            BUZZ<span className="text-yellow-500">SCOOP</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={"flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition " + (pathname === item.href ? "bg-yellow-400 text-black" : "text-gray-300 hover:bg-gray-800")}>
              <span className="text-base flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800 flex-shrink-0">
          <Link href="/" target="_blank" className="block text-center text-xs text-gray-400 hover:text-yellow-400 mb-2">Back to Site</Link>
          <button onClick={logout} className="w-full text-center text-xs text-red-400 hover:text-red-300">Logout</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 min-h-screen">
        <div className="md:hidden sticky top-0 z-30 bg-white border-b px-3 py-2 flex items-center gap-2">
          <button onClick={() => setOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xl">M</button>
          <Link href="/$SECRET/dashboard" className="font-black">BUZZ<span className="text-yellow-500">SCOOP</span></Link>
        </div>
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
"@
Write-Page "$adminPath\layout.tsx" $layoutContent

# ROOT PAGE
$rootPage = @"
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRoot() {
  const router = useRouter();
  useEffect(() => { router.replace("/$SECRET/login"); }, [router]);
  return <div style={{ padding: "40px", textAlign: "center" }}>Redirecting...</div>;
}
"@
Write-Page "$adminPath\page.tsx" $rootPage

# LOGIN
$loginPage = @"
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) router.push("/$SECRET/dashboard");
    else { const d = await res.json(); setError(d.error || "Login failed"); setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#111827", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 900, margin: 0 }}>BUZZ<span style={{ color: "#eab308" }}>SCOOP</span></h1>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>Admin Login</p>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Username" style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "16px" }} />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "16px" }} />
          {error && <p style={{ color: "red", fontSize: "14px", textAlign: "center" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ background: "#eab308", fontWeight: 900, padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px", cursor: "pointer" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
"@
Write-Page "$adminPath\login\page.tsx" $loginPage

# DASHBOARD
$dashPage = @"
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/articles").then(r => r.json()).then(d => setArticles(Array.isArray(d) ? d : [])).catch(() => setArticles([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "8px" }}>Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: "32px" }}>Welcome to BuzzScoop Admin</p>
      <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "24px" }}>
        <div style={{ fontSize: "32px" }}>A</div>
        <div style={{ fontSize: "28px", fontWeight: 900 }}>{loading ? "..." : articles.length}</div>
        <div style={{ fontSize: "12px", color: "#6b7280" }}>Total Articles</div>
      </div>
      <div style={{ background: "white", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontWeight: 900, marginBottom: "16px" }}>Recent Articles</h2>
        {loading ? <p>Loading...</p> : articles.length === 0 ? <p>No articles yet.</p> :
         <ul>{articles.slice(0, 5).map(a => <li key={a.id} style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>{a.title}</li>)}</ul>}
      </div>
    </div>
  );
}
"@
Write-Page "$adminPath\dashboard\page.tsx" $dashPage

# ARTICLES LIST
$articlesPage = @"
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/admin/articles");
    const data = await res.json();
    setArticles(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function del(id: string, title: string) {
    if (!confirm("Delete " + title + "?")) return;
    await fetch("/api/admin/articles/" + id, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: 0 }}>Articles</h1>
        <Link href="/$SECRET/articles/new" style={{ background: "#eab308", color: "black", fontWeight: 700, padding: "10px 20px", borderRadius: "8px", textDecoration: "none" }}>New Article</Link>
      </div>
      {loading ? <p>Loading...</p> : articles.length === 0 ? <p>No articles yet.</p> :
       <div style={{ background: "white", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
         <table style={{ width: "100%", fontSize: "14px" }}>
           <thead style={{ background: "#f9fafb" }}>
             <tr><th style={{ textAlign: "left", padding: "12px" }}>Title</th><th style={{ textAlign: "left", padding: "12px" }}>Category</th><th style={{ textAlign: "right", padding: "12px" }}>Actions</th></tr>
           </thead>
           <tbody>
             {articles.map(a => (
               <tr key={a.id} style={{ borderTop: "1px solid #f3f4f6" }}>
                 <td style={{ padding: "12px" }}>{a.title}</td>
                 <td style={{ padding: "12px" }}>{a.category}</td>
                 <td style={{ padding: "12px", textAlign: "right" }}>
                   <button onClick={() => del(a.id, a.title)} style={{ color: "red", background: "none", border: "none", cursor: "pointer" }}>Delete</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>}
    </div>
  );
}
"@
Write-Page "$adminPath\articles\page.tsx" $articlesPage

# NEW ARTICLE
$newArticlePage = @"
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATS = ["Netflix", "Hollywood", "Marvel", "Music", "Streaming", "TV", "Awards", "Celebrity"];

export default function NewArticle() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", content: "", category: "Netflix", author: "BuzzScoop Team", date: new Date().toISOString().split("T")[0], tags: "" });

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
    if (field === "title") setForm(f => ({ ...f, slug: value.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") }));
  }

  async function save() {
    if (!form.title || !form.content) return alert("Title and content required");
    setSaving(true);
    const res = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) }) });
    if (res.ok) router.push("/$SECRET/articles");
    else { alert("Save failed"); setSaving(false); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, margin: 0 }}>New Article</h1>
        <button onClick={save} disabled={saving} style={{ background: "#eab308", fontWeight: 700, padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", background: "white", padding: "24px", borderRadius: "12px" }}>
        <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Title" style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "18px", fontWeight: 700 }} />
        <input value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="slug" style={{ padding: "8px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
        <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={3} placeholder="Description" style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
        <textarea value={form.content} onChange={e => update("content", e.target.value)} rows={12} placeholder="Content" style={{ padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px" }} />
        <select value={form.category} onChange={e => update("category", e.target.value)} style={{ padding: "8px", border: "1px solid #d1d5db", borderRadius: "8px" }}>
          {CATS.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
    </div>
  );
}
"@
Write-Page "$adminPath\articles\new\page.tsx" $newArticlePage

# PLACEHOLDERS (14 pages)
$placeholders = "ai-writer","auto-queue","trends","media","revisions","comments","analytics","newsletter","categories","authors","users","security","backend","settings"
foreach ($name in $placeholders) {
    $content = @"
"use client";
export default function Page() {
  return (
    <div>
      <h1 style={{ fontSize: "28px", fontWeight: 900 }}>$name</h1>
      <div style={{ marginTop: "32px", background: "white", padding: "60px", borderRadius: "12px", textAlign: "center", border: "1px solid #e5e7eb" }}>
        <p style={{ color: "#6b7280" }}>Coming soon</p>
      </div>
    </div>
  );
}
"@
    Write-Page "$adminPath\$name\page.tsx" $content
}

Write-Host "  Done" -ForegroundColor Green

# Final
Write-Host ""
Write-Host "[4/4] Verifying..." -ForegroundColor Yellow
$count = (Get-ChildItem $adminPath -Recurse -File -Filter "*.tsx").Count
Write-Host "  Total files: $count" -ForegroundColor Cyan

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "REBUILD COMPLETE!" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT: npm run dev" -ForegroundColor Yellow
Write-Host "TEST: http://localhost:3000/$SECRET" -ForegroundColor Yellow
Write-Host "LOGIN: admin / admin123" -ForegroundColor Yellow
Write-Host ""