import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";

export const revalidate = 30;

export default function BreakingPage() {
  const posts = getAllPosts().slice(0, 10);
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6 flex items-center gap-3">
        <span className="animate-pulse">🔴</span> Breaking News
      </h1>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.slug} className="p-4 bg-white border rounded-xl hover:border-yellow-400">
            <Link href={`/blog/${p.slug}`} className="font-bold hover:text-yellow-600">
              {p.title}
            </Link>
            <p className="text-sm text-gray-500 mt-1">{p.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}