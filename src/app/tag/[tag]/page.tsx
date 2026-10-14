import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getAllTags, getPostsByTag } from "@/lib/seo";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = getAllPosts();
  const tags = getAllTags(posts);
  return tags.map(({ tag }) => ({ tag }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
  const { tag } = await params;
  const title = tag.charAt(0).toUpperCase() + tag.slice(1);
  const url = `https://buzzscoop.news/tag/${tag}`;
  return {
    title: `${title} News & Articles`,
    description: `Browse all ${title} articles on BuzzScoop — latest entertainment news and updates.`,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} News | BuzzScoop`,
      description: `All ${title} articles on BuzzScoop.`,
      url,
      type: "website",
    },
  };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const allPosts = getAllPosts();
  const posts = getPostsByTag(allPosts, tag);

  if (posts.length === 0) notFound();

  const title = tag.charAt(0).toUpperCase() + tag.slice(1);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 border-b-4 border-yellow-400 pb-4">
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-yellow-600">Home</Link>
          <span className="mx-2">/</span>
          <span>Tags</span>
        </div>
        <h1 className="text-4xl font-black">#{title}</h1>
        <p className="text-gray-500 mt-2">{posts.length} article{posts.length !== 1 ? "s" : ""}</p>
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
              <span className="text-xs font-bold text-yellow-600 uppercase">
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