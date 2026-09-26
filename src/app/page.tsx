import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";

export const revalidate = 30;

export default function Home() {
  const posts = getAllPosts();
  return (
    <main className="max-w-5xl mx-auto px-4 py-6">
      <header className="mb-8 border-b-4 border-yellow-400 pb-4">
        <h1 className="text-4xl font-black tracking-tight">
          BUZZ<span className="text-yellow-500">SCOOP</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">Entertainment News — Netflix, Hollywood, Pop Culture</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
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
    </main>
  );
}