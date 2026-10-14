"use client";

import Link from "next/link";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./advanced/MobileMenu";
import { CategoryDropdown } from "./ux/CategoryDropdown";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/category/netflix", label: "Netflix" },
  { href: "/category/hollywood", label: "Hollywood" },
  { href: "/category/marvel", label: "Marvel" },
  { href: "/videos", label: "Videos" },
  { href: "/podcast", label: "Podcast" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        {/* ROW 1: Mobile menu + Logo + Search + Icons */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <MobileMenu />
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="text-xl sm:text-2xl font-black tracking-tight">
                BUZZ<span className="text-yellow-500">SCOOP</span>
              </span>
            </Link>
          </div>

          {/* Search bar â€” desktop */}
          <div className="hidden md:block flex-1 max-w-xs">
            <SearchBar />
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            <Link
              href="/bookmarks"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
              aria-label="Bookmarks"
            >
              ðŸ”–
            </Link>
            <a
              href="/feed.xml"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition text-sm"
              aria-label="RSS"
            >
              ðŸ“¡
            </a>

            {/* âœ… DARK MODE TOGGLE â€” WAPAS */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-2">
          <SearchBar />
        </div>

        {/* ROW 2: Navigation + Categories + Breaking */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 mt-3 -mb-1 overflow-x-auto hide-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 hover:text-yellow-600 dark:text-gray-300 dark:hover:text-yellow-400 whitespace-nowrap transition"
            >
              {link.label}
            </Link>
          ))}

          {/* âœ… Categories Dropdown */}
          <CategoryDropdown />

          {/* Breaking news */}
          <Link
            href="/breaking"
            className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 whitespace-nowrap"
          >
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            Breaking
          </Link>
        </nav>
      </div>
    </header>
  );
}