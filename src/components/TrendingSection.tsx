import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";

export function TrendingSection() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="mb-6 sm:mb-8 w-full">
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-2xl font-black">🔥 Trending Now</h2>
        <div className="flex-1 h-1 bg-yellow-400 rounded"></div>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-yellow-400 transition dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-yellow-600">
                #{i + 1} • {post.category}
              </span>
              <h3 className="mt-1 text-sm font-bold leading-snug line-clamp-2 group-hover:text-yellow-600">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}