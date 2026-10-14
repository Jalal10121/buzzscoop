import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllPosts } from "@/lib/mdx";

export const revalidate = 30;

const VALID_CATEGORIES = ["netflix", "hollywood", "marvel", "music", "streaming", "tv", "awards", "celeb"];

export async function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const title = category.charAt(0).toUpperCase() + category.slice(1);
  return {
    title: `${title} News`,
    description: `Latest ${title} news and updates on BuzzScoop.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const allPosts = getAllPosts();
  const posts = allPosts.filter((p) => p.category.toLowerCase() === category.toLowerCase());

  const title = category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 border-b-4 border-yellow-400 pb-4">
        <h1 className="text-4xl font-black">{title} News</h1>
        <p className="text-gray-500 mt-2">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No articles in this category yet.</p>
          <Link href="/" className="text-yellow-600 font-bold hover:underline">
            ← Back to Home
          </Link>
        </div>
      ) : (
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
      )}
    </main>
  );
}