import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import Image from "next/image";

export default function NotFound() {
  const posts = getAllPosts().slice(0, 3);

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-9xl font-black text-yellow-400 mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500 transition"
      >
        ← Back to Home
      </Link>

      {posts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-bold mb-6">📰 You might like these</h3>
          <div className="grid gap-5 sm:grid-cols-3 text-left">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-lg overflow-hidden border border-gray-100 hover:border-yellow-400"
              >
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-bold line-clamp-2 group-hover:text-yellow-600">
                    {post.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}