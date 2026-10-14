import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";

export const revalidate = 30;

export default function WebStoriesPage() {
  const posts = getAllPosts().slice(0, 9);
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-2">⚡ Web Stories</h1>
      <p className="text-gray-500 mb-8">Swipe-through visual stories — perfect for mobile</p>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden">
            <Image src={post.image} alt={post.title} fill sizes="25vw"
              className="object-cover group-hover:scale-105 transition" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-3 text-white">
              <span className="text-xs bg-yellow-400 text-black font-bold px-2 py-0.5 rounded-full">
                {post.category}
              </span>
              <h3 className="mt-2 text-sm font-bold leading-tight line-clamp-3">{post.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}