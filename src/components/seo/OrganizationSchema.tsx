export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BuzzScoop",
    url: "https://buzzscoop.news",
    logo: "https://buzzscoop.news/logo.png",
    description: "BuzzScoop brings you the latest entertainment news, Netflix updates, Hollywood buzz, and pop culture scoops — daily.",
    sameAs: [
      "https://twitter.com/buzzscoop",
      "https://instagram.com/buzzscoop",
      "https://youtube.com/@buzzscoop",
      "https://facebook.com/buzzscoop",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "hello@buzzscoop.news",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}