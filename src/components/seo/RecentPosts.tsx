import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export function RecentPosts({ limit = 5, currentSlug }: { limit?: number; currentSlug?: string }) {
  const posts = getAllPosts()
    .filter((p) => p.slug !== currentSlug)
    .slice(0, limit);

  if (posts.length === 0) return null;

  return (
    <section className="my-8">
      <h3 className="text-lg font-black mb-4">📰 Recent News</h3>
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <h4 className="text-sm font-bold leading-snug line-clamp-2 group-hover:text-yellow-600">
                {post.title}
              </h4>
              <time className="text-xs text-gray-500 mt-1 block">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}