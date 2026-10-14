import type { Metadata } from "next";
import { SocialFollow } from "@/components/marketing/SocialFollow";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

export const metadata: Metadata = {
  title: "Follow BuzzScoop",
  description: "Follow BuzzScoop on Twitter, Instagram, YouTube, TikTok, Telegram, and WhatsApp. Subscribe to our free newsletter.",
};

export default function FollowPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-black mb-3">📢 Follow BuzzScoop</h1>
        <p className="text-lg text-gray-600">
          Stay updated on every platform you love
        </p>
      </div>

      <SocialFollow variant="inline" />

      <div className="mt-10 bg-gray-900 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-black mb-2">📬 Daily Newsletter</h2>
        <p className="text-gray-400 mb-6">
          Get the top 5 entertainment scoops in your inbox every morning.
        </p>
        <NewsletterForm />
      </div>

      <div className="mt-10 prose prose-lg max-w-none">
        <h2>Why Follow BuzzScoop?</h2>
        <ul>
          <li><strong>Breaking news alerts</strong> — Be first to know</li>
          <li><strong>Exclusive scoops</strong> — Stories you won&apos;t find elsewhere</li>
          <li><strong>Behind-the-scenes</strong> — Studio updates, cast news</li>
          <li><strong>Daily deals</strong> — Streaming discounts</li>
        </ul>
      </div>
    </main>
  );
}