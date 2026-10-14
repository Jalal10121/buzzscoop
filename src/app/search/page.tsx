import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Search",
  description: "Search BuzzScoop entertainment news.",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").toLowerCase().trim();

  const allPosts = getAllPosts();
  const results = query
    ? allPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query)
      )
    : [];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 border-b-4 border-yellow-400 pb-4">
        <h1 className="text-4xl font-black">Search</h1>
        {query && (
          <p className="text-gray-600 mt-2">
            {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
            <strong>&quot;{q}&quot;</strong>
          </p>
        )}
      </div>

      {!query && (
        <p className="text-gray-500 text-center py-16">
          Type in the search bar above to find articles.
        </p>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">
            No articles found for &quot;{q}&quot;
          </p>
          <Link href="/" className="text-yellow-600 font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-xl overflow-hidden border border-gray-100 hover:border-yellow-400 transition"
            >
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority={i < 3}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <span className="text-xs font-bold text-yellow-600 uppercase tracking-wide">
                  {post.category}
                </span>
                <h2 className="mt-1 text-lg font-bold leading-snug line-clamp-2">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}