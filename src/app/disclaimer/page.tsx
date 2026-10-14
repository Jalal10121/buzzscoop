import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "BuzzScoop disclaimer — information about our content.",
};

export default function DisclaimerPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6">Disclaimer</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: September 25, 2026</p>

      <div className="prose prose-lg max-w-none">
        <h2>General Information</h2>
        <p>
          The information on <strong>BuzzScoop</strong> is for general informational and entertainment purposes only. We make no warranties about the accuracy or completeness of any information.
        </p>

        <h2>Entertainment News</h2>
        <p>
          Our content covers entertainment news, rumors, and speculation. Some stories may be based on unverified sources. We recommend verifying important information through official channels.
        </p>

        <h2>External Links</h2>
        <p>
          BuzzScoop contains links to external websites. We are not responsible for the content or practices of these sites.
        </p>

        <h2>No Professional Advice</h2>
        <p>
          Our content is not professional advice. For legal, financial, or medical decisions, consult a professional.
        </p>

        <h2>Copyright</h2>
        <p>
          If you believe your copyrighted work has been used improperly, contact us at hello@buzzscoop.news.
        </p>

        <h2>Consent</h2>
        <p>
          By using BuzzScoop, you consent to this disclaimer.
        </p>
      </div>
    </main>
  );
}