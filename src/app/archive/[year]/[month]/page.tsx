import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { getArchives, getPostsByYearMonth } from "@/lib/seo";

export const revalidate = 60;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export async function generateStaticParams() {
  const posts = getAllPosts();
  const archives = getArchives(posts);
  return archives.map(({ year, month }) => ({
    year: year.toString(),
    month: month.toString(),
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string; month: string }> }): Promise<Metadata> {
  const { year, month } = await params;
  const monthName = MONTH_NAMES[parseInt(month) - 1];
  return {
    title: `${monthName} ${year} Archive`,
    description: `All articles from ${monthName} ${year} on BuzzScoop.`,
  };
}

export default async function ArchivePage({ params }: { params: Promise<{ year: string; month: string }> }) {
  const { year, month } = await params;
  const yearNum = parseInt(year);
  const monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    notFound();
  }

  const allPosts = getAllPosts();
  const posts = getPostsByYearMonth(allPosts, yearNum, monthNum);

  if (posts.length === 0) notFound();

  const monthName = MONTH_NAMES[monthNum - 1];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 border-b-4 border-yellow-400 pb-4">
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-yellow-600">Home</Link>
          <span className="mx-2">/</span>
          <span>Archive</span>
        </div>
        <h1 className="text-4xl font-black">{monthName} {yearNum}</h1>
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
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}