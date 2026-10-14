"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCommentNotifications } from "@/lib/useCommentNotifications";

const NAV: { href: string; label: string; icon: string; badge?: boolean }[] = [
  { href: "/panel-24e075625579/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/panel-24e075625579/articles", label: "Articles", icon: "📝" },
  { href: "/panel-24e075625579/articles/new", label: "New Article", icon: "➕" },
  { href: "/panel-24e075625579/ai-writer", label: "AI Writer", icon: "✨" },
  { href: "/panel-24e075625579/auto-queue", label: "Auto Queue", icon: "🤖" },
  { href: "/panel-24e075625579/trends", label: "Trends", icon: "📈" },
  { href: "/panel-24e075625579/media", label: "Media", icon: "🖼" },
  { href: "/panel-24e075625579/image-finder", label: "Image Finder", icon: "🎨" },
  { href: "/panel-24e075625579/revisions", label: "Revisions", icon: "📜" },
  { href: "/panel-24e075625579/comments", label: "Comments", icon: "💬", badge: true },
  { href: "/panel-24e075625579/analytics", label: "Analytics", icon: "📈" },
  { href: "/panel-24e075625579/newsletter", label: "Newsletter", icon: "📬" },
  { href: "/panel-24e075625579/categories", label: "Categories", icon: "📁" },
  { href: "/panel-24e075625579/authors", label: "Authors", icon: "👤" },
  { href: "/panel-24e075625579/users", label: "Users", icon: "👥" },
  { href: "/panel-24e075625579/security", label: "Security", icon: "🛡" },
  { href: "/panel-24e075625579/backend", label: "Backend", icon: "🚀" },
  { href: "/panel-24e075625579/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pendingComments, setPendingComments] = useState(0);

  useCommentNotifications();

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("admin-active");

    try {
      const savedCollapsed = localStorage.getItem("buzzscoop-sidebar-collapsed");
      if (savedCollapsed === "true") setSidebarCollapsed(true);

      const savedDark = localStorage.getItem("buzzscoop-admin-dark");
      if (savedDark === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    } catch (e) {}

    // Fetch pending comments count
    function loadPendingCount() {
      fetch("/api/admin/comments")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const pending = data.filter((c) => c.status === "pending").length;
            setPendingComments(pending);
          }
        })
        .catch(() => {});
    }

    loadPendingCount();
    const interval = setInterval(loadPendingCount, 60000);

    return () => {
      clearInterval(interval);
      document.body.classList.remove("admin-active");
    };
  }, []);

  function toggleSidebar() {
    if (typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      const next = !sidebarCollapsed;
      setSidebarCollapsed(next);
      try {
        localStorage.setItem("buzzscoop-sidebar-collapsed", String(next));
      } catch (e) {}
    }
  }

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    try {
      localStorage.setItem("buzzscoop-admin-dark", String(next));
    } catch (e) {}
    document.documentElement.classList.toggle("dark", next);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/panel-24e075625579/login");
  }

  if (pathname.includes("/login")) return <>{children}</>;
  if (!mounted) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 overflow-x-hidden">
      {/* ADMIN HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-xl transition cursor-pointer"
              aria-label="Toggle sidebar"
            >
              ☰
            </button>
            <Link href="/panel-24e075625579/dashboard" className="flex items-center gap-2">
              <span className="text-lg font-black text-gray-900 dark:text-white whitespace-nowrap">
                BUZZ<span className="text-yellow-500">SCOOP</span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-2 hidden sm:inline">Admin</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden md:block relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-48 px-3 py-1.5 pr-8 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:outline-none focus:border-yellow-400"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            </div>

            <button
              onClick={toggleDark}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lg transition cursor-pointer"
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-lg transition relative cursor-pointer"
              aria-label="Notifications"
            >
              🔔
              {pendingComments > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {pendingComments}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-sm transition cursor-pointer"
                aria-label="User menu"
              >
                A
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div
                    className="fixed z-50 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1"
                    style={{ top: "60px", right: "12px" }}
                  >
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Admin User</p>
                      <p className="text-xs text-gray-500 truncate">admin@buzzscoop.news</p>
                    </div>
                    <Link
                      href="/panel-24e075625579/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>⚙️</span><span>Settings</span>
                    </Link>
                    <Link
                      href="/"
                      target="_blank"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <span>🌐</span><span>View Site</span>
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={() => { setUserMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                    >
                      <span>🚪</span><span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <aside
          className={`fixed md:sticky top-14 bottom-0 md:top-14 md:h-[calc(100vh-3.5rem)] z-50 bg-gray-900 text-white flex flex-col transform transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} ${sidebarCollapsed ? "md:w-20" : "md:w-64"} w-64`}
        >
          <div className="md:hidden p-4 border-b border-gray-800 flex items-center justify-between">
            <span className="text-lg font-black">BUZZ<span className="text-yellow-500">SCOOP</span></span>
            <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800 text-xl cursor-pointer">✕</button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1 sidebar-scroll">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-lg text-sm font-medium transition py-2.5 ${sidebarCollapsed ? "md:justify-center md:px-2" : "px-4"} ${pathname === item.href ? "bg-yellow-400 text-black" : "text-gray-300 hover:bg-gray-800"}`}
              >
                <span className="text-base flex-shrink-0">{item.icon}</span>
                <span className={`${sidebarCollapsed ? "md:hidden" : ""} whitespace-nowrap flex-1`}>{item.label}</span>
                {item.badge && pendingComments > 0 && !sidebarCollapsed && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {pendingComments}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className={`p-4 border-t border-gray-800 flex-shrink-0 ${sidebarCollapsed ? "md:text-center" : ""}`}>
            <Link href="/" target="_blank" className={`block text-xs text-gray-400 hover:text-yellow-400 mb-2 ${sidebarCollapsed ? "md:hidden" : ""}`}>
              ← View Site
            </Link>
            <button onClick={logout} className={`w-full text-xs text-red-400 hover:text-red-300 cursor-pointer ${sidebarCollapsed ? "md:hidden" : ""}`}>
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 min-w-0 min-h-[calc(100vh-3.5rem)]">
          <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}