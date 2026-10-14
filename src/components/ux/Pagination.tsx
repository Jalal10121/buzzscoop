"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete("page");
    else params.set("page", page.toString());
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center gap-2 my-10" aria-label="Pagination">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:border-yellow-400 text-sm font-medium"
        >
          ← Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            page === currentPage
              ? "bg-yellow-400 text-black"
              : "border border-gray-300 hover:border-yellow-400"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:border-yellow-400 text-sm font-medium"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}