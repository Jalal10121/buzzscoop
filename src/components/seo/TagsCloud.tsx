import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import { getAllTags } from "@/lib/seo";

export function TagsCloud({ limit = 20 }: { limit?: number }) {
  const posts = getAllPosts();
  const tags = getAllTags(posts).slice(0, limit);

  if (tags.length === 0) return null;

  return (
    <section className="my-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
            🏷️ Browse Tags
          </h3>
        </div>

        {/* Tags */}
        <div className="p-4 flex flex-wrap gap-2">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                bg-gray-100 text-gray-700 hover:bg-yellow-400 hover:text-black hover:shadow-md hover:-translate-y-0.5
                dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-yellow-400 dark:hover:text-black"
            >
              <span className="text-gray-500 dark:text-gray-400">#</span>
              <span>{tag}</span>
              <span className="text-gray-400 dark:text-gray-500 text-[10px]">({count})</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}