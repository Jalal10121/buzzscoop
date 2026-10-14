"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  {
    title: "Main",
    links: [
      { href: "/", label: "Home", icon: "🏠" },
      { href: "/breaking", label: "Breaking News", icon: "🔴", badge: "LIVE" },
      { href: "/for-you", label: "For You", icon: "✨" },
      { href: "/bookmarks", label: "Bookmarks", icon: "🔖" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/category/netflix", label: "Netflix", icon: "🎬" },
      { href: "/category/hollywood", label: "Hollywood", icon: "🌟" },
      { href: "/category/marvel", label: "Marvel", icon: "🦸" },
      { href: "/category/music", label: "Music", icon: "🎵" },
      { href: "/category/streaming", label: "Streaming", icon: "📺" },
    ],
  },
  {
    title: "Media",
    links: [
      { href: "/videos", label: "Videos", icon: "🎥" },
      { href: "/podcast", label: "Podcast", icon: "🎙️" },
      { href: "/web-stories", label: "Web Stories", icon: "⚡" },
      { href: "/deals", label: "Best Deals", icon: "💎" },
    ],
  },
  {
    title: "More",
    links: [
      { href: "/newsletter", label: "Newsletter", icon: "📬" },
      { href: "/about", label: "About Us", icon: "ℹ️" },
      { href: "/contact", label: "Contact", icon: "✉️" },
    ],
  },
];

const SOCIALS = [
  { href: "https://twitter.com/buzzscoop", label: "Twitter", icon: "𝕏" },
  { href: "https://instagram.com/buzzscoop", label: "Instagram", icon: "📷" },
  { href: "https://youtube.com/@buzzscoop", label: "YouTube", icon: "▶️" },
  { href: "https://t.me/buzzscoop", label: "Telegram", icon: "✈️" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const trigger = document.getElementById("mobile-menu-trigger");
    if (!trigger) return;
    const handler = () => setOpen(true);
    trigger.addEventListener("click", handler);
    return () => trigger.removeEventListener("click", handler);
  }, [mounted]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!mounted || !open) return null;

  const drawer = (
    <>
      {/* Backdrop with blur */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "fadeIn 0.2s ease-out",
        }}
        aria-hidden="true"
      />

      {/* LEFT SLIDE-IN DRAWER */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "85vw",
          maxWidth: "340px",
          background: "#ffffff",
          zIndex: 9999,
          overflowY: "auto",
          boxShadow: "8px 0 32px rgba(0,0,0,0.25)",
          animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="dark:bg-gray-900"
      >
        {/* Gradient Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 50%, #2a2a2a 100%)",
            padding: "20px 20px 24px",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              style={{ textDecoration: "none" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "#FFD700",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: "18px",
                    color: "#000",
                  }}
                >
                  B
                </div>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#ffffff",
                    letterSpacing: "-0.5px",
                  }}
                >
                  BUZZ<span style={{ color: "#FFD700" }}>SCOOP</span>
                </span>
              </div>
            </Link>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.1)",
                color: "#ffffff",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              className="hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "12px",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Entertainment News • Updated Daily
          </p>
        </div>

        {/* Sections */}
        <div style={{ padding: "16px 12px" }}>
          {SECTIONS.map((section) => (
            <div key={section.title} style={{ marginBottom: "16px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  padding: "0 12px",
                  marginBottom: "6px",
                }}
                className="dark:text-gray-500"
              >
                {section.title}
              </p>

              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {section.links.map((l) => {
                  const isActive = pathname === l.href;
                  return (
                    <li key={l.href} style={{ marginBottom: "2px" }}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "11px 12px",
                          borderRadius: "10px",
                          textDecoration: "none",
                          fontWeight: 500,
                          fontSize: "15px",
                          color: isActive ? "#000000" : "#374151",
                          background: isActive ? "#FFD700" : "transparent",
                          position: "relative",
                          transition: "all 0.15s ease",
                        }}
                        className={isActive ? "" : "hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"}
                      >
                        {isActive && (
                          <span
                            style={{
                              position: "absolute",
                              left: 0,
                              top: "20%",
                              bottom: "20%",
                              width: "3px",
                              borderRadius: "0 4px 4px 0",
                              background: "#000000",
                            }}
                          />
                        )}

                        <span
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            background: isActive ? "rgba(0,0,0,0.1)" : "#f3f4f6",
                            flexShrink: 0,
                          }}
                          className={isActive ? "" : "dark:bg-gray-800"}
                        >
                          {l.icon}
                        </span>

                        <span style={{ flex: 1 }}>{l.label}</span>

                        {l.badge && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: 900,
                              color: "#ffffff",
                              background: "#dc2626",
                              padding: "2px 6px",
                              borderRadius: "6px",
                              animation: "pulse 2s infinite",
                            }}
                          >
                            {l.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Icons — NO ADMIN LINK */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #e5e7eb",
            background: "#fafafa",
          }}
          className="dark:bg-gray-800 dark:border-gray-700"
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 800,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Follow Us
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  textDecoration: "none",
                  transition: "all 0.15s",
                }}
                className="hover:bg-black hover:text-white dark:bg-gray-900 dark:border-gray-700"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Animations */}
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(-100%); opacity: 0.5; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
        `}</style>
      </aside>
    </>
  );

  return createPortal(drawer, document.body);
}