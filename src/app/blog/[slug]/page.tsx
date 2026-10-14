import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import readingTime from "reading-time";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ReadingProgress } from "@/components/ReadingProgress";
import { ShareButtons } from "@/components/ShareButtons";
import { RelatedArticles } from "@/components/RelatedArticles";
import { AuthorBio } from "@/components/AuthorBio";
import { TableOfContents } from "@/components/TableOfContents";
import { ArticleReactions } from "@/components/ArticleReactions";
import { BackToTop } from "@/components/BackToTop";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Comments } from "@/components/Comments";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

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
  const url = `https://buzzscoop.news/blog/${post.slug}`;

  return (
    <>
      <ReadingProgress />
      <AnalyticsTracker slug={post.slug} />
      <article className="max-w-3xl mx-auto px-4 py-6">
        {/* Category badge */}
        <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
          {post.category}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mt-1 mb-3 dark:text-white">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-5 flex-wrap">
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

        {/* Featured Image */}
        {post.image && (
          <div className="relative aspect-video mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}

        {/* Share buttons (top) */}
        <ShareButtons url={url} title={post.title} />

        {/* Table of Contents */}
        <TableOfContents content={post.content} />

        {/* Content */}
        <MarkdownRenderer content={post.content} />

        {/* Reactions */}
        <ArticleReactions slug={post.slug} />

        {/* Share buttons (bottom) */}
        <ShareButtons url={url} title={post.title} />

        {/* Author Bio */}
        <AuthorBio name={post.author} />

        {/* Newsletter */}
        <NewsletterSignup />

        {/* Related Articles */}
        <RelatedArticles currentPost={post} />

        {/* Comments */}
        <Comments slug={post.slug} />

        {/* Back to home */}
        <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <Link href="/" className="inline-block text-sm font-semibold text-yellow-600 hover:underline">
            ← More BuzzScoop News
          </Link>
        </footer>
      </article>
      <BackToTop />
    </>
  );
}