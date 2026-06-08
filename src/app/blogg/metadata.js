// app/blogg/metadata.js

// SwapDeals konfiguration för hela Sverige
export const siteConfig = {
  name: 'SwapDeals',
  title: 'SwapDeals Blogg | Hållbarhet & Cirkulär Ekonomi',
  description: 'Expertguider om hållbart liv, cirkulär ekonomi och smart konsumtion. Lär dig hur du kan bidra till en grönare framtid genom att köpa och sälja begagnat i Sverige.',
  url: 'https://swapdeals.se',
  geo: {
    lat: 62.3908,
    lng: 16.3261,
  },
  region: 'SE',
  wikidata: 'Q34',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#16a34a', // green-600
};

export const socialLinks = {
  instagram: 'https://www.instagram.com/swapdeals.se/',
  facebook: 'https://www.facebook.com/swapdeals',
  twitter: 'https://twitter.com/swapdeals',
};

// Genererar metadata för bloggen
export async function generateMetadata() {
  return {
    title: siteConfig.title,
    description: siteConfig.description,
    authors: [{ name: 'SwapDeals' }],
   
    openGraph: {
      title: siteConfig.title,
      description: siteConfig.description,
      type: 'website',
      locale: 'sv_SE',
      url: `${siteConfig.url}/blogg`,
      siteName: siteConfig.name,
      images: [
        {
          url: `${siteConfig.url}/og-blogg.jpg`,
          width: 1200,
          height: 630,
          alt: 'SwapDeals Blogg - Hållbarhet & Cirkulär Ekonomi',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: siteConfig.title,
      description: siteConfig.description,
      images: [`${siteConfig.url}/og-blogg.jpg`],
      creator: '@swapdeals',
    },
    alternates: {
      canonical: `${siteConfig.url}/blogg`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'geo.region': siteConfig.region,
      'geo.placename': 'Sverige',
      'geo.position': `${siteConfig.geo.lat};${siteConfig.geo.lng}`,
      'ICBM': `${siteConfig.geo.lat}, ${siteConfig.geo.lng}`,
    },
  };
}

// Blog JSON-LD
export function generateBlogJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${siteConfig.url}/blogg#blog`,
    name: 'SwapDeals Blogg',
    description: 'Expertguider om hållbarhet, cirkulär ekonomi och smart konsumtion för en grönare framtid',
    url: `${siteConfig.url}/blogg`,
    inLanguage: 'sv-SE',
    image: `${siteConfig.url}/og-blogg.jpg`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: Object.values(socialLinks),
    },
    about: {
      '@type': 'Thing',
      name: 'Hållbarhet och Cirkulär Ekonomi',
      description: 'Information och guider om hållbart liv och cirkulär ekonomi',
    },
    spatialCoverage: {
      '@type': 'Place',
      name: 'Sverige',
      geo: {
        '@type': 'GeoCoordinates',
        latitude: siteConfig.geo.lat,
        longitude: siteConfig.geo.lng,
      },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'SE',
      },
    },
  };
}

// WebPage JSON-LD
export function generateWebPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteConfig.url}/blogg#webpage`,
    url: `${siteConfig.url}/blogg`,
    name: siteConfig.title,
    description: siteConfig.description,
    inLanguage: 'sv-SE',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
      name: siteConfig.name,
      url: siteConfig.url,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/og-blogg.jpg`,
      width: 1200,
      height: 630,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Hem',
          item: siteConfig.url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blogg',
          item: `${siteConfig.url}/blogg`,
        },
      ],
    },
  };
}

// FAQ JSON-LD för bloggsidan
export function generateBlogFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Vad handlar SwapDeals blogg om?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SwapDeals blogg fokuserar på hållbarhet, cirkulär ekonomi och smart konsumtion. Vi delar expertguider om hur du kan leva mer miljövänligt genom att köpa och sälja begagnat, minska avfall och göra medvetna konsumentval.',
        },
      },
      {
        '@type': 'Question',
        name: 'Varför är cirkulär ekonomi viktigt?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Cirkulär ekonomi minskar avfall och resursförbrukning genom att hålla produkter och material i användning längre. Genom att köpa begagnat och sälja det du inte använder bidrar du till att minska miljöpåverkan och bekämpa klimatförändringarna samtidigt som du sparar pengar.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hur kan jag bidra till en mer hållbar framtid?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Du kan bidra genom att köpa begagnat istället för nytt, sälja eller skänka saker du inte använder, välja hållbara alternativ när du handlar, minska matsvinn och engagera dig i klimatfrågor. Varje litet steg räknas och tillsammans skapar vi stor förändring.',
        },
      },
      {
        '@type': 'Question',
        name: 'Sparar man verkligen pengar på att köpa begagnat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ja, definitivt! Begagnade varor kostar ofta en bråkdel av nypriset men har fortfarande lång livslängd kvar. Dessutom kan du tjäna pengar genom att sälja dina egna saker. Det är ekonomiskt smart samtidigt som det är bra för miljön.',
        },
      },
      {
        '@type': 'Question',
        name: 'Hur ofta publiceras nya artiklar på bloggen?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vi publicerar regelbundet nya artiklar om hållbarhet, cirkulär ekonomi och smart konsumtion. Prenumerera på vårt nyhetsbrev för att få de senaste artiklarna och tipsen direkt i din inkorg.',
        },
      },
    ],
  };
}

// Organization JSON-LD
export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/logo.png`,
      width: 512,
      height: 512,
    },
    description: 'Sveriges marknadsplats för cirkulär ekonomi - köp och sälj begagnat för en hållbar framtid',
    sameAs: Object.values(socialLinks),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: ['Swedish'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Sverige',
    },
  };
}

// Breadcrumb JSON-LD
export function generateBreadcrumbJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hem',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blogg',
        item: `${siteConfig.url}/blogg`,
      },
    ],
  };
}

// CollectionPage JSON-LD (för bloggöversikten)
export function generateCollectionPageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${siteConfig.url}/blogg#collection`,
    url: `${siteConfig.url}/blogg`,
    name: 'Hållbarhetsartiklar och guider',
    description: 'Samling av artiklar om hållbarhet, cirkulär ekonomi och smart konsumtion',
    inLanguage: 'sv-SE',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
    },
  };
}
