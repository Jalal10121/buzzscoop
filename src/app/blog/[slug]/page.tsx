import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import readingTime from "reading-time";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { JsonLd } from "@/components/JsonLd";

export const revalidate = 60;

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `https://buzzscoop.news/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image],
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const rt = readingTime(post.content);

  return (
    <article className="max-w-article mx-auto px-4 py-6">
      <JsonLd post={post} />
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-black font-bold">BUZZSCOOP</Link>
        <span className="mx-2">/</span>
        <span className="text-yellow-600 font-medium">{post.category}</span>
      </nav>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3">
        {post.title}
      </h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-5">
        <span>By {post.author}</span>
        <span>•</span>
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long", day: "numeric", year: "numeric",
          })}
        </time>
        <span>•</span>
        <span>{rt.text}</span>
      </div>
      <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gray-100">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 672px"
          className="object-cover"
        />
      </div>
      <div className="prose prose-lg prose-gray max-w-none">
        <MDXRemote source={post.content} />
      </div>
      <footer className="mt-10 pt-6 border-t border-gray-200">
        <Link href="/" className="inline-block text-sm font-semibold text-yellow-600 hover:underline">
          ← More BuzzScoop News
        </Link>
      </footer>
    </article>
  );
}