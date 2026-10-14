interface StreamingDeal {
  service: string;
  logo: string;
  offer: string;
  price: string;
  originalPrice?: string;
  url: string;
  color: string;
}

const DEALS: StreamingDeal[] = [
  {
    service: "Netflix",
    logo: "🎬",
    offer: "Standard with Ads",
    price: "$6.99/mo",
    originalPrice: "$7.99",
    url: "https://netflix.com/signup",
    color: "bg-red-600",
  },
  {
    service: "Disney+ Bundle",
    logo: "🏰",
    offer: "Disney+ + Hulu + ESPN+",
    price: "$14.99/mo",
    url: "https://disneyplus.com",
    color: "bg-blue-600",
  },
  {
    service: "HBO Max",
    logo: "🎭",
    offer: "Limited time offer",
    price: "$2.99/mo",
    originalPrice: "$9.99",
    url: "https://max.com",
    color: "bg-purple-700",
  },
  {
    service: "Apple TV+",
    logo: "🍎",
    offer: "3 months free with device",
    price: "Free",
    url: "https://apple.com/tv",
    color: "bg-gray-900",
  },
];

export function StreamingAffiliateBox() {
  return (
    <section className="my-8 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-black">💎 Best Streaming Deals</h3>
        <p className="text-sm text-gray-600 mt-1">
          Save up to 70% on your favorite streaming services
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEALS.map((deal) => (
          <a
            key={deal.service}
            href={deal.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-400 hover:shadow-md transition"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{deal.logo}</span>
              <div>
                <div className="font-bold">{deal.service}</div>
                <div className="text-xs text-gray-500">{deal.offer}</div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-red-600">{deal.price}</span>
              {deal.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {deal.originalPrice}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        We may earn a commission when you sign up through our links.
      </p>
    </section>
  );
}