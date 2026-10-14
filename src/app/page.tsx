import { getAllPosts } from "@/lib/mdx";
import { TrendingSection } from "@/components/TrendingSection";
import { HeaderAd } from "@/components/ads/HeaderAd";
import { PopularPosts } from "@/components/seo/PopularPosts";
import { TagsCloud } from "@/components/seo/TagsCloud";
import { ArticleCard } from "@/components/ArticleCard";

export const revalidate = 30;

export default async function Home() {
  const posts = getAllPosts();

  return (
    <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      <HeaderAd />
      <TrendingSection />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-black dark:text-white">
              📰 Latest News
            </h2>
            <div className="flex-1 h-1 bg-yellow-400 rounded"></div>
          </div>

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, i) => (
              <ArticleCard key={post.slug} post={post} priority={i < 3} />
            ))}
          </div>
        </div>

        <aside className="lg:col-span-1 text-gray-900 dark:text-gray-100">
          <div className="lg:sticky lg:top-24">
            <PopularPosts limit={5} />
            <TagsCloud limit={15} />
          </div>
        </aside>
      </div>
    </main>
  );
}