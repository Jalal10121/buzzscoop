import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/monetization/NewsletterSignup";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "Subscribe to BuzzScoop daily entertainment news newsletter.",
};

export default function NewsletterPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-4">BuzzScoop Newsletter</h1>
      <p className="text-lg text-gray-700 mb-8">
        Get the best entertainment scoops delivered to your inbox — every morning, free.
      </p>

      <NewsletterSignup />

      <div className="mt-12 prose prose-lg max-w-none">
        <h2>What You&apos;ll Get</h2>
        <ul>
          <li>🔥 Top 5 trending entertainment stories</li>
          <li>🎬 Netflix new releases of the week</li>
          <li>🎵 Music drops and album reviews</li>
          <li>💡 Exclusive deals on streaming platforms</li>
        </ul>

        <h2>Why Subscribe?</h2>
        <ul>
          <li>✅ 100% free</li>
          <li>✅ No spam, ever</li>
          <li>✅ Unsubscribe anytime</li>
        </ul>
      </div>
    </main>
  );
}