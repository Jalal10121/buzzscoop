import Image from "next/image";

interface AmazonProductBoxProps {
  title: string;
  image: string;
  price: string;
  rating?: number;
  asin: string;
  description?: string;
}

export function AmazonProductBox({
  title,
  image,
  price,
  rating = 4.5,
  asin,
  description,
}: AmazonProductBoxProps) {
  const affiliateTag = process.env.NEXT_PUBLIC_AMAZON_TAG || "buzzscoop-20";
  const url = `https://www.amazon.com/dp/${asin}?tag=${affiliateTag}`;

  return (
    <div className="my-6 border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        <div className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="128px"
            className="object-contain"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-yellow-600 uppercase mb-1">
            🛒 Recommended
          </div>
          <h3 className="font-bold text-lg leading-tight mb-2">{title}</h3>
          {description && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">{description}</p>
          )}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-500">{"★".repeat(Math.round(rating))}</span>
            <span className="text-sm text-gray-500">{rating}</span>
            <span className="text-lg font-bold text-red-600 ml-auto">{price}</span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-block w-full sm:w-auto text-center bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition"
          >
            Buy on Amazon →
          </a>
          <p className="text-xs text-gray-400 mt-2">
            As an Amazon Associate, we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </div>
  );
}