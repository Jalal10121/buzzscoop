import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with BuzzScoop — send us tips, feedback, or partnership inquiries.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black mb-6">Contact Us</h1>

      <p className="text-lg text-gray-700 mb-8">
        Have a news tip, feedback, or business inquiry? We'd love to hear from you.
      </p>

      <div className="space-y-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h3 className="font-bold text-lg mb-2">📧 General Inquiries</h3>
          <p className="text-gray-700">hello@buzzscoop.news</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h3 className="font-bold text-lg mb-2">🎬 News Tips</h3>
          <p className="text-gray-700">tips@buzzscoop.news</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h3 className="font-bold text-lg mb-2">💼 Advertising</h3>
          <p className="text-gray-700">ads@buzzscoop.news</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 rounded">
          <h3 className="font-bold text-lg mb-2">🌐 Follow Us</h3>
          <p className="text-gray-700">
            Twitter: <a href="https://twitter.com/buzzscoop" className="text-yellow-600 hover:underline">@buzzscoop</a><br />
            Instagram: <a href="https://instagram.com/buzzscoop" className="text-yellow-600 hover:underline">@buzzscoop</a>
          </p>
        </div>
      </div>

      <p className="mt-12 text-sm text-gray-500">
        We typically respond within 24-48 hours.
      </p>
    </main>
  );
}