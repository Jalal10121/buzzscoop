import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BuzzScoop Premium — Ad-Free Entertainment News",
  description: "Upgrade to BuzzScoop Premium for ad-free reading, exclusive scoops, and early access to entertainment news.",
};

export default function PremiumPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-4">
          ✨ Premium
        </span>
        <h1 className="text-5xl font-black mb-4">BuzzScoop Premium</h1>
        <p className="text-xl text-gray-600">
          Support independent entertainment journalism. Get exclusive content.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="border-2 border-gray-200 rounded-2xl p-8">
          <h2 className="text-2xl font-black mb-2">Free</h2>
          <p className="text-4xl font-black mb-6">$0</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">✅ Daily entertainment news</li>
            <li className="flex items-center gap-2">✅ Weekly newsletter</li>
            <li className="flex items-center gap-2">✅ All articles</li>
            <li className="flex items-center gap-2 text-gray-400">❌ Ad-free experience</li>
            <li className="flex items-center gap-2 text-gray-400">❌ Exclusive scoops</li>
            <li className="flex items-center gap-2 text-gray-400">❌ Early access</li>
          </ul>
          <Link
            href="/"
            className="block text-center border-2 border-gray-300 font-bold py-3 rounded-lg hover:bg-gray-50"
          >
            Continue Free
          </Link>
        </div>

        <div className="border-4 border-yellow-400 rounded-2xl p-8 bg-yellow-50 relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1 rounded-full">
            MOST POPULAR
          </span>
          <h2 className="text-2xl font-black mb-2">Premium</h2>
          <p className="text-4xl font-black mb-1">$4.99<span className="text-lg">/mo</span></p>
          <p className="text-sm text-gray-500 mb-6">or $49/year (save 17%)</p>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">✅ Everything in Free</li>
            <li className="flex items-center gap-2 font-bold">✅ Ad-free experience</li>
            <li className="flex items-center gap-2 font-bold">✅ Exclusive scoops</li>
            <li className="flex items-center gap-2 font-bold">✅ Early access (24h before)</li>
            <li className="flex items-center gap-2 font-bold">✅ Premium newsletter</li>
            <li className="flex items-center gap-2 font-bold">✅ Direct line to editors</li>
          </ul>
          <a
            href="https://buymeacoffee.com/buzzscoop"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 rounded-lg transition"
          >
            Upgrade Now →
          </a>
        </div>
      </div>

      <section className="prose prose-lg max-w-none">
        <h2>Why Premium?</h2>
        <p>
          Independent entertainment journalism takes time, research, and resources. By going Premium, you help us keep BuzzScoop free from intrusive ads and clickbait. Your subscription goes directly into better reporting, faster scoops, and deeper analysis.
        </p>

        <h2>What You Get</h2>
        <ul>
          <li><strong>Ad-free:</strong> Clean, fast reading experience</li>
          <li><strong>Exclusive scoops:</strong> Stories you won&apos;t find anywhere else</li>
          <li><strong>Early access:</strong> Read breaking news 24 hours before anyone else</li>
          <li><strong>Premium newsletter:</strong> Deep dives, analysis, and predictions</li>
        </ul>

        <h2>Cancel Anytime</h2>
        <p>
          No contracts, no hidden fees. Cancel with one click whenever you want.
        </p>
      </section>
    </main>
  );
}