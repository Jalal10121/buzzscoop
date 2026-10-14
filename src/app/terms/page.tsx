import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "BuzzScoop terms of service — rules for using our website.",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 25, 2026</p>

      <div className="prose prose-lg max-w-none">
        <p>
          By using <strong>BuzzScoop</strong>, you agree to these terms. If you disagree, please do not use the site.
        </p>

        <h2>1. Use of Content</h2>
        <p>
          All content on BuzzScoop is for personal, non-commercial use. You may not copy, reproduce, or redistribute our content without permission.
        </p>

        <h2>2. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Post illegal, harmful, or offensive content</li>
          <li>Attempt to hack or disrupt the site</li>
          <li>Use automated tools to scrape content</li>
          <li>Impersonate BuzzScoop or its team</li>
        </ul>

        <h2>3. Intellectual Property</h2>
        <p>
          All trademarks, logos, and content are property of BuzzScoop or their respective owners.
        </p>

        <h2>4. Third-Party Links</h2>
        <p>
          BuzzScoop may link to third-party sites. We are not responsible for their content or practices.
        </p>

        <h2>5. Disclaimer</h2>
        <p>
          Content is provided "as is." We make no warranties about accuracy, completeness, or reliability.
        </p>

        <h2>6. Limitation of Liability</h2>
        <p>
          BuzzScoop is not liable for any damages arising from your use of the site.
        </p>

        <h2>7. Changes to Terms</h2>
        <p>
          We may update these terms. Continued use means you accept the changes.
        </p>

        <h2>8. Contact</h2>
        <p>Questions? Email <strong>hello@buzzscoop.news</strong>.</p>
      </div>
    </main>
  );
}