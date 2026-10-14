import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sponsored Content & Advertising",
  description: "Partner with BuzzScoop to reach millions of entertainment fans. Sponsored posts, display ads, and newsletter placements.",
};

export default function SponsoredPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6">Advertise on BuzzScoop</h1>

      <p className="text-lg text-gray-700 mb-8">
        Reach millions of engaged entertainment fans. Our audience loves movies, TV, streaming, and pop culture — and they trust our recommendations.
      </p>

      <div className="grid gap-6 mb-10">
        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-black mb-2">📝 Sponsored Post</h2>
          <p className="text-gray-600 mb-3">
            A dedicated article written by our team, featuring your brand.
          </p>
          <p className="text-2xl font-black text-yellow-600">$500+</p>
          <ul className="text-sm text-gray-600 mt-3 space-y-1">
            <li>• 800-1000 words</li>
            <li>• Featured on homepage</li>
            <li>• Social media promotion</li>
            <li>• Newsletter mention</li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-black mb-2">📢 Display Ads</h2>
          <p className="text-gray-600 mb-3">
            Premium ad placements across the site.
          </p>
          <p className="text-2xl font-black text-yellow-600">$20 CPM</p>
          <ul className="text-sm text-gray-600 mt-3 space-y-1">
            <li>• Header, sidebar, in-article</li>
            <li>• Mobile + desktop</li>
            <li>• Geo-targeting available</li>
          </ul>
        </div>

        <div className="border border-gray-200 rounded-xl p-6">
          <h2 className="text-2xl font-black mb-2">📬 Newsletter Placement</h2>
          <p className="text-gray-600 mb-3">
            Direct to 10,000+ subscribers.
          </p>
          <p className="text-2xl font-black text-yellow-600">$200/issue</p>
          <ul className="text-sm text-gray-600 mt-3 space-y-1">
            <li>• Top placement</li>
            <li>• 40%+ open rate</li>
            <li>• Dedicated section</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
        <h3 className="font-bold text-lg mb-2">Interested?</h3>
        <p className="text-gray-700 mb-3">
          Contact us to discuss custom packages, pricing, and availability.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-yellow-500"
        >
          Get in Touch →
        </Link>
      </div>
    </main>
  );
}