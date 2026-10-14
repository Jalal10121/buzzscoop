import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "BuzzScoop privacy policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 25, 2026</p>

      <div className="prose prose-lg max-w-none">
        <p>
          At <strong>BuzzScoop</strong>, we respect your privacy. This policy explains what data we collect and how we use it.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect:</p>
        <ul>
          <li>Browser type, device info, and operating system</li>
          <li>IP address and approximate location</li>
          <li>Pages visited and time spent</li>
          <li>Referring website</li>
        </ul>

        <h2>2. Cookies</h2>
        <p>
          We use cookies to improve your experience, analyze traffic, and serve relevant ads. You can disable cookies in your browser settings.
        </p>

        <h2>3. Third-Party Services</h2>
        <p>We may use:</p>
        <ul>
          <li><strong>Google Analytics</strong> — to analyze site traffic</li>
          <li><strong>Google AdSense</strong> — to serve ads</li>
          <li><strong>Social media plugins</strong> — for sharing</li>
        </ul>

        <h2>4. How We Use Your Data</h2>
        <p>We use collected data to:</p>
        <ul>
          <li>Improve content and user experience</li>
          <li>Analyze traffic patterns</li>
          <li>Serve relevant ads</li>
          <li>Respond to inquiries</li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We implement industry-standard security measures to protect your data. However, no method is 100% secure.
        </p>

        <h2>6. Your Rights</h2>
        <p>
          You may request access, correction, or deletion of your data by contacting us at hello@buzzscoop.news.
        </p>

        <h2>7. Children's Privacy</h2>
        <p>
          BuzzScoop is not intended for children under 13. We do not knowingly collect data from children.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this policy. Changes will be posted on this page with a new "last updated" date.
        </p>

        <h2>9. Contact</h2>
        <p>Questions? Email us at <strong>hello@buzzscoop.news</strong>.</p>
      </div>
    </main>
  );
}