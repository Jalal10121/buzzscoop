import type { Post } from "@/lib/mdx";

export function JsonLd({ post }: { post: Post }) {
  const iso = new Date(post.date).toISOString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title.slice(0, 110),
    description: post.description,
    image: [post.image],
    datePublished: iso,
    dateModified: iso,
    author: [{ "@type": "Person", name: post.author }],
    publisher: {
      "@type": "Organization",
      name: "BuzzScoop",
      logo: {
        "@type": "ImageObject",
        url: "https://buzzscoop.news/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://buzzscoop.news/blog/${post.slug}`,
    },
    articleSection: post.category,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://buzzscoop.news",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category,
        item: `https://buzzscoop.news/category/${post.category.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://buzzscoop.news/blog/${post.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}