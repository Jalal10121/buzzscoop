import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = getAllPosts();
  const authors = [...new Set(posts.map((p) => p.author))];
  return authors.map((author) => ({
    author: author.toLowerCase().replace(/\s+/g, "-"),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ author: string }> }) {
  const { author } = await params;
  const name = author.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Articles by ${name}`,
    description: `Read all articles by ${name} on BuzzScoop.`,
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ author: string }> }) {
  const { author } = await params;
  const allPosts = getAllPosts();
  const authorName = author.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const posts = allPosts.filter(
    (p) => p.author.toLowerCase().replace(/\s+/g, "-") === author
  );

  if (posts.length === 0) notFound();

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center text-4xl font-black text-black mx-auto mb-4">
          {authorName.charAt(0)}
        </div>
        <h1 className="text-3xl font-black">{authorName}</h1>
        <p className="text-gray-500 mt-1">
          {posts.length} article{posts.length !== 1 ? "s" : ""} published
        </p>
      </div>

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
                sizes="(max-width: 640px) 100vw, 33vw"
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
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}