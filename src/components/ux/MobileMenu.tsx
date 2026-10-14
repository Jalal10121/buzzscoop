"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/category/netflix", label: "Netflix" },
  { href: "/category/hollywood", label: "Hollywood" },
  { href: "/category/marvel", label: "Marvel" },
  { href: "/category/music", label: "Music" },
  { href: "/category/streaming", label: "Streaming" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/bookmarks", label: "🔖 Bookmarks" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
      >
        <span className="text-xl">{open ? "✕" : "☰"}</span>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 md:hidden shadow-2xl overflow-y-auto">
            <div className="p-5 border-b">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="text-2xl font-black"
              >
                BUZZ<span className="text-yellow-500">SCOOP</span>
              </Link>
            </div>
            <ul className="p-4 space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-gray-800 hover:bg-yellow-50 hover:text-yellow-700 font-medium transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}