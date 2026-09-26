import type { Post } from "@/lib/mdx";

export function JsonLd({ post }: { post: Post }) {
  const iso = new Date(post.date).toISOString();
  const schema = {
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
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://buzzscoop.news/blog/${post.slug}`,
    },
    articleSection: post.category,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}