export function ProductJsonLd({
  name, description, price, currency = "EUR", image, url, shopName,
}: {
  name: string; description?: string; price: number;
  currency?: string; image?: string; url: string; shopName?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: image ? [image] : undefined,
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: "https://schema.org/InStock",
      seller: shopName ? { "@type": "Organization", name: shopName } : undefined,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ArticleJsonLd({
  title, description, image, url, publishedAt, authorName = "Spectrum For Us",
}: {
  title: string; description?: string; image?: string;
  url: string; publishedAt?: string; authorName?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image ? [image] : undefined,
    url,
    datePublished: publishedAt,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "Spectrum For Us",
      logo: { "@type": "ImageObject", url: "https://spectrumforus.com/logo.png" },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Spectrum For Us",
    url: "https://spectrumforus.com",
    description: "La première marketplace queer",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://spectrumforus.com/decouvrir?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Spectrum For Us",
    url: "https://spectrumforus.com",
    logo: "https://spectrumforus.com/logo.png",
    sameAs: [
      "https://instagram.com/spectrumforus",
      "https://www.tiktok.com/@spectrum.4.us",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@spectrumforus.com",
      contactType: "customer support",
      availableLanguage: ["French", "English", "Arabic"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
