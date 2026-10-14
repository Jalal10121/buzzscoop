import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "BuzzScoop is your daily source for entertainment news, Netflix updates, Hollywood buzz, and pop culture scoops.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6">About BuzzScoop</h1>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed">
          <strong>BuzzScoop</strong> is your daily dose of entertainment news — from Netflix's latest releases to Hollywood's biggest headlines, Marvel's upcoming projects, and everything in between.
        </p>

        <h2>Our Mission</h2>
        <p>
          We believe entertainment news should be fast, accurate, and fun. Our team tracks the latest updates from streaming platforms, movie studios, and music labels so you never miss a beat.
        </p>

        <h2>What We Cover</h2>
        <ul>
          <li><strong>Netflix:</strong> New releases, renewals, cancellations, and behind-the-scenes scoops</li>
          <li><strong>Hollywood:</strong> Movie news, casting updates, box office reports</li>
          <li><strong>Marvel & DC:</strong> MCU updates, casting rumors, release dates</li>
          <li><strong>Music:</strong> Album drops, tours, and artist news</li>
          <li><strong>Streaming:</strong> Deals, comparisons, and platform updates</li>
        </ul>

        <h2>Why BuzzScoop?</h2>
        <p>
          In a world of clickbait and misinformation, BuzzScoop delivers <strong>verified, fast, and reliable</strong> entertainment news. No fluff. No fake stories. Just the scoop you need.
        </p>

        <h2>Contact</h2>
        <p>
          Have a tip? Want to collaborate? Reach out at <a href="/contact">our contact page</a> or email us at <strong>hello@buzzscoop.news</strong>.
        </p>
      </div>
    </main>
  );
}