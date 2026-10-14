import Link from "next/link";

interface SponsoredPostProps {
  brand: string;
  brandLogo?: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  image: string;
}

export function SponsoredPost({
  brand,
  headline,
  description,
  ctaText,
  ctaUrl,
  image,
}: SponsoredPostProps) {
  return (
    <div className="my-8 border-2 border-purple-300 rounded-xl overflow-hidden bg-purple-50">
      <div className="bg-purple-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide flex items-center justify-between">
        <span>📢 Sponsored by {brand}</span>
        <span className="text-purple-200">Advertisement</span>
      </div>

      <div className="flex flex-col md:flex-row">
        <div
          className="w-full md:w-1/3 h-48 md:h-auto bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
        <div className="flex-1 p-6">
          <h3 className="text-xl font-black mb-2">{headline}</h3>
          <p className="text-gray-700 text-sm mb-4">{description}</p>
          <a
            href={ctaUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-lg transition"
          >
            {ctaText} →
          </a>
        </div>
      </div>
    </div>
  );
}