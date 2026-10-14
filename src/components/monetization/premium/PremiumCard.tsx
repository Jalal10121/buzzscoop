import Link from "next/link";

export function PremiumCard() {
  return (
    <section className="my-8 p-6 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl">
      <div className="text-center mb-6">
        <span className="inline-block bg-yellow-400 text-black text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-3">
          ✨ Premium
        </span>
        <h3 className="text-3xl font-black">BuzzScoop Premium</h3>
        <p className="text-gray-400 mt-2">
          Ad-free reading, exclusive scoops, early access
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-lg p-4">
          <h4 className="font-bold text-lg mb-2">Free</h4>
          <p className="text-2xl font-black mb-3">$0</p>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>✅ Daily news</li>
            <li>✅ Newsletter</li>
            <li>❌ Ad-free</li>
            <li>❌ Exclusive content</li>
          </ul>
        </div>

        <div className="bg-yellow-400 text-black rounded-lg p-4 relative">
          <span className="absolute top-2 right-2 text-xs font-black">BEST VALUE</span>
          <h4 className="font-bold text-lg mb-2">Premium</h4>
          <p className="text-2xl font-black mb-3">$4.99<span className="text-sm">/mo</span></p>
          <ul className="space-y-1 text-sm">
            <li>✅ Everything in Free</li>
            <li>✅ <strong>Ad-free experience</strong></li>
            <li>✅ Exclusive scoops</li>
            <li>✅ Early access</li>
            <li>✅ Premium newsletter</li>
          </ul>
        </div>
      </div>

      <Link
        href="/premium"
        className="block text-center bg-white text-black font-black py-3 rounded-lg hover:bg-gray-100 transition"
      >
        Upgrade to Premium →
      </Link>
    </section>
  );
}