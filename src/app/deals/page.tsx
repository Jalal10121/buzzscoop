import type { Metadata } from "next";
import { StreamingAffiliateBox } from "@/components/monetization/affiliate/StreamingAffiliateBox";
import { ComparisonTable } from "@/components/monetization/affiliate/ComparisonTable";

export const metadata: Metadata = {
  title: "Streaming Deals & Discounts — September 2026",
  description: "Save money on Netflix, Disney+, HBO Max, and more with the best streaming deals this month.",
};

export default function DealsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black mb-3">💎 Streaming Deals</h1>
        <p className="text-lg text-gray-600">
          Save up to 70% on your favorite streaming services
        </p>
      </div>

      <StreamingAffiliateBox />

      <ComparisonTable
        title="Streaming Services Compared"
        rows={[
          {
            name: "Netflix",
            price: "$6.99/mo",
            bestFor: "Original series",
            rating: 4.8,
            url: "https://netflix.com",
            highlight: true,
          },
          {
            name: "Disney+ Bundle",
            price: "$14.99/mo",
            bestFor: "Family + Sports",
            rating: 4.6,
            url: "https://disneyplus.com",
          },
          {
            name: "HBO Max",
            price: "$9.99/mo",
            bestFor: "Premium dramas",
            rating: 4.5,
            url: "https://max.com",
          },
          {
            name: "Apple TV+",
            price: "$9.99/mo",
            bestFor: "Quality originals",
            rating: 4.4,
            url: "https://apple.com/tv",
          },
          {
            name: "Amazon Prime Video",
            price: "$8.99/mo",
            bestFor: "Value + shipping",
            rating: 4.3,
            url: "https://amazon.com/prime",
          },
        ]}
      />

      <section className="prose prose-lg max-w-none mt-12">
        <h2>How to Save on Streaming</h2>
        <ol>
          <li><strong>Bundle services:</strong> Disney+ + Hulu + ESPN+ = $14.99 vs $25+ separately</li>
          <li><strong>Annual plans:</strong> Most services offer 15-20% discount</li>
          <li><strong>Ad-supported tiers:</strong> Save $2-3/month per service</li>
          <li><strong>Share family plans:</strong> Split costs with family members</li>
          <li><strong>Cancel unused:</strong> Rotate services monthly</li>
        </ol>

        <p className="text-sm text-gray-500">
          <strong>Disclosure:</strong> BuzzScoop may earn a commission when you sign up through our links. This helps keep our content free.
        </p>
      </section>
    </main>
  );
}