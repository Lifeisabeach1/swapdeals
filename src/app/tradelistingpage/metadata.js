// app/bytesannonser/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: 'SwapDeals | Bytesannonser | Second Hand Sverige',
  description: 'Utforska bytesannonser från hela Sverige. Byt begagnade varor utan mellanhand. ✓ Säkra byten ✓ Verifierade användare ✓ Gratis byteshandel',
  authors: [{ name: 'SwapDeals', url: 'https://swapdeals.se' }],
  creator: 'SwapDeals',
  publisher: 'SwapDeals',
  applicationName: 'SwapDeals',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: 'Trade Listings',
  classification: 'Peer-to-Peer Trading Platform',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/bytesannonser',
    siteName: 'SwapDeals',
    title: 'Bytesannonser | SwapDeals Second Hand Byten',
    description: 'Bläddra bland bytesannonser från hela Sverige. Byteshandel av begagnade varor mellan privatpersoner.',
    images: [
      {
        url: '/trades-hero.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Bytesannonser Second Hand Sverige',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsUppsa',
    creator: '@SwapDealsUppsa',
    title: 'Bytesannonser | SwapDeals',
    description: 'Bläddra bland bytesannonser från hela Sverige. Gratis second hand byteshandel.',
    images: {
      url: '/trades-hero.webp',
      alt: 'SwapDeals Bytesannonser'
    }
  },
  alternates: {
    canonical: 'https://swapdeals.se/bytesannonser',
    languages: {
      'sv-SE': 'https://swapdeals.se/bytesannonser',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'geo.region': 'SE',
    'geo.placename': 'Sverige',
    'language': 'sv-SE',
    'content-language': 'sv-SE',
    'contact': 'info@swapdeals.se',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals',
    'theme-color': '#10b981',
    'msapplication-TileColor': '#10b981',
  }
};

// ItemList JSON-LD for trade listings
export const itemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': 'https://swapdeals.se/bytesannonser#itemlist',
  name: 'Bytesannonser på SwapDeals',
  description: 'Aktuella bytesannonser för second hand varor i Sverige',
  url: 'https://swapdeals.se/bytesannonser',
  numberOfItems: 0, // This should be dynamically updated
};

// CollectionPage JSON-LD
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/bytesannonser#collection',
  name: 'Alla Bytesannonser på SwapDeals',
  description: 'Utforska alla tillgängliga bytesannonser för begagnade varor från hela Sverige',
  url: 'https://swapdeals.se/bytesannonser',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website',
    name: 'SwapDeals'
  },
  about: {
    '@type': 'Thing',
    name: 'Byteshandel och Second Hand Annonser'
  }
};

// Service JSON-LD
export const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://swapdeals.se/bytesannonser#service',
  name: 'SwapDeals Bytesplattform',
  description: 'Gratis plattform för att byta begagnade varor mellan privatpersoner i Sverige',
  serviceType: 'Peer-to-Peer Trading Platform',
  provider: {
    '@type': 'Organization',
    name: 'SwapDeals',
    url: 'https://swapdeals.se'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sverige'
  }
};

// FAQ JSON-LD
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/bytesannonser#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hur fungerar bytesannonser på SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'På SwapDeals kan du lägga upp bytesannonser för begagnade varor du vill byta. Du anger vad du söker och andra medlemmar kan kontakta dig för att föreslå byten. All kommunikation sker direkt mellan medlemmarna.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kostar det något att använda SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nej, SwapDeals är helt gratis att använda. Det kostar inget att lägga upp bytesannonser eller att kontakta andra medlemmar för att genomföra byten.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur filtrerar jag bytesannonser?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Du kan filtrera bytesannonser efter plats/stad, kategori och använda sökfunktionen för att hitta specifika varor. Använd filtren i sidomenyn för att snabbt hitta det du söker.'
      }
    },
    {
      '@type': 'Question',
      name: 'Är alla bytesannonser verifierade?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alla medlemmar på SwapDeals är verifierade vilket skapar en säkrare miljö för byteshandel. Vi modererar aktivt plattformen för att säkerställa kvalitet och säkerhet.'
      }
    }
  ]
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/bytesannonser#breadcrumb',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Hem',
      item: 'https://swapdeals.se'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Bytesannonser',
      item: 'https://swapdeals.se/bytesannonser'
    }
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/bytesannonser#webpage',
  url: 'https://swapdeals.se/bytesannonser',
  name: 'Bytesannonser | SwapDeals',
  description: 'Bläddra bland bytesannonser för begagnade varor från hela Sverige. Byteshandel mellan privatpersoner.',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website'
  },
  breadcrumb: {
    '@id': 'https://swapdeals.se/bytesannonser#breadcrumb'
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/trades-hero.webp',
    width: 1200,
    height: 630
  },
  datePublished: '2025-01-15T10:00:00Z',
  dateModified: '2025-01-15T10:00:00Z',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization'
  }
};
