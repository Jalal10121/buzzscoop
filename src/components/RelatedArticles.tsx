import Link from "next/link";
import Image from "next/image";
import { getAllPosts, type Post } from "@/lib/mdx";

export function RelatedArticles({ currentPost }: { currentPost: Post }) {
  const related = getAllPosts()
    .filter((p) => p.slug !== currentPost.slug && p.category === currentPost.category)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-black mb-6 dark:text-white">
        More in {currentPost.category}
      </h2>
      <div className="grid gap-5 sm:grid-cols-3">
        {related.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="group block cursor-pointer">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image src={post.image} alt={post.title} fill unoptimized sizes="33vw" className="object-cover group-hover:scale-105 transition" />
            </div>
            <h3 className="mt-3 text-sm font-bold leading-snug line-clamp-2 group-hover:text-yellow-600 dark:text-gray-200">
              {post.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}