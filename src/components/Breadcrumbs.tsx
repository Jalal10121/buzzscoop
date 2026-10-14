import Link from "next/link";

interface BreadcrumbsProps {
  category: string;
  title: string;
}

export function Breadcrumbs({ category, title }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-500">
      <ol className="flex items-center flex-wrap gap-1">
        <li>
          <Link href="/" className="hover:text-yellow-600">Home</Link>
        </li>
        <li className="text-gray-300">/</li>
        <li>
          <Link
            href={`/category/${category.toLowerCase()}`}
            className="hover:text-yellow-600"
          >
            {category}
          </Link>
        </li>
        <li className="text-gray-300">/</li>
        <li className="text-gray-700 font-medium truncate max-w-[200px]">
          {title}
        </li>
      </ol>
    </nav>
  );
}