import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export function PopularPosts({ limit = 5 }: { limit?: number }) {
  const posts = getAllPosts().slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <section className="my-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
            🔥 Popular Now
          </h3>
        </div>

        {/* List */}
        <ol className="divide-y divide-gray-100 dark:divide-gray-700">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {/* Number Badge */}
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-sm font-black text-black shadow-sm">
                  {i + 1}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold leading-snug text-gray-900 dark:text-gray-100 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                    {post.title}
                  </h4>
                  <span className="inline-block mt-1.5 text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-0.5 rounded">
                    {post.category}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}