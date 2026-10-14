import Link from "next/link";

interface AffiliateLinkProps {
  href: string;
  children: React.ReactNode;
  partner?: string;
  className?: string;
}

export function AffiliateLink({
  href,
  children,
  partner = "affiliate",
  className = "",
}: AffiliateLinkProps) {
  // Add your affiliate tags here
  const affiliateUrls: Record<string, string> = {
    amazon: "?tag=buzzscoop-20",
    netflix: "?ref=buzzscoop",
    // Add more partners as needed
  };

  const url = href + (affiliateUrls[partner] || "");

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`text-yellow-600 underline hover:text-yellow-700 ${className}`}
    >
      {children}
    </a>
  );
}