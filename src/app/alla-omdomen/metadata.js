// app/alla-omdomen/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: 'SwapDeals | Alla Omdömen | Second Hand Byten',
  description: 'Läs alla verifierade omdömen från våra medlemmar. Se vad andra säger om sina bytesupplevelser på SwapDeals. ✓ Äkta recensioner ✓ Verifierade användare ✓ Community feedback',
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
  category: 'Community Reviews',
  classification: 'User Testimonials and Reviews',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/alla-omdomen',
    siteName: 'SwapDeals',
    title: 'Alla Omdömen | SwapDeals Community Feedback',
    description: 'Utforska äkta omdömen från SwapDeals medlemmar. Se vad andra tycker om sina bytesupplevelser i Sverige. Verifierade recensioner från riktiga användare.',
    images: [
      {
        url: '/testimonials-hero.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Omdömen och Recensioner från Sverige',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsUppsa',
    creator: '@SwapDealsUppsa',
    title: 'Alla Omdömen | SwapDeals',
    description: 'Läs äkta omdömen från SwapDeals medlemmar. Verifierade recensioner från bytesupplevelser i Sverige.',
    images: {
      url: '/testimonials-hero.webp',
      alt: 'SwapDeals Omdömen och Recensioner'
    }
  },
  alternates: {
    canonical: 'https://swapdeals.se/alla-omdomen',
    languages: {
      'sv-SE': 'https://swapdeals.se/alla-omdomen',
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
    'locality': 'Sverige',
    'country-name': 'Sweden',
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

// CollectionPage JSON-LD for testimonials listing
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/alla-omdomen#collection',
  name: 'Alla Omdömen på SwapDeals',
  description: 'Samling av verifierade omdömen och recensioner från SwapDeals medlemmar över hela Sverige',
  url: 'https://swapdeals.se/alla-omdomen',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website',
    name: 'SwapDeals'
  },
  about: {
    '@type': 'Thing',
    name: 'Användarrecensioner och Omdömen'
  }
};



// Service JSON-LD for SwapDeals platform
export const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://swapdeals.se/alla-omdomen#service',
  name: 'SwapDeals Bytesplattform',
  description: 'Community-driven bytesplattform för att byta varor och tjänster i hela Sverige. Säker handel mellan privatpersoner med verifierade användare.',
  serviceType: 'Peer-to-Peer Trading Platform',
  provider: {
    '@type': 'Organization',
    name: 'SwapDeals',
    url: 'https://swapdeals.se'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sverige',
    '@id': 'https://www.wikidata.org/wiki/Q34'
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'SwapDeals Tjänster',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Säker Byteshandel',
          description: 'Plattform för säkra byten mellan privatpersoner'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Verifierade Användare',
          description: 'Alla användare verifieras för säkrare transaktioner'
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Community Support',
          description: 'Aktivt community med hjälpsamma medlemmar'
        }
      }
    ]
  },
  review: {
    '@type': 'Review',
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '4.8',
      bestRating: '5'
    },
    author: {
      '@type': 'Organization',
      name: 'SwapDeals Community'
    }
  }
};

// FAQ JSON-LD for testimonials page
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/alla-omdomen#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hur verifieras omdömena på SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Alla omdömen på SwapDeals kommer från verifierade användare som genomfört faktiska byten på plattformen. Vi kontrollerar att varje recension är autentisk och från en verklig transaktion.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kan jag lita på recensionerna?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, alla recensioner är från äkta medlemmar som använt SwapDeals. Vi modererar aktivt och tar bort bedrägliga eller falska recensioner. Verifierade omdömen markeras med en speciell badge.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur lämnar jag ett omdöme?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Efter att du genomfört ett byte på SwapDeals får du möjlighet att betygsätta din upplevelse. Du kan ge ett betyg från 1-5 stjärnor och skriva en kommentar om din bytesupplevelse.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vad är genomsnittligt betyg på SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SwapDeals har ett genomsnittligt betyg på 4.8 av 5 stjärnor baserat på över 150 verifierade recensioner från nöjda medlemmar över hela Sverige.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kan jag filtrera omdömen efter betyg?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, på omdömessidan kan du filtrera recensioner efter antal stjärnor (5, 4+, eller 3+ stjärnor) och sortera efter datum, betyg eller namn för att hitta den feedback som är mest relevant för dig.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur hanterar SwapDeals negativa omdömen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vi tar all feedback på allvar. Negativa omdömen publiceras om de är konstruktiva och relevanta. Vi använder feedbacken för att förbättra vår plattform och hjälper medlemmar att lösa eventuella problem.'
      }
    }
  ]
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/alla-omdomen#breadcrumb',
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
      name: 'Community',
      item: 'https://swapdeals.se/community'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Alla Omdömen',
      item: 'https://swapdeals.se/alla-omdomen'
    }
  ]
};

// WebPage JSON-LD with review data
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/alla-omdomen#webpage',
  url: 'https://swapdeals.se/alla-omdomen',
  name: 'Alla Omdömen | SwapDeals',
  description: 'Läs alla verifierade omdömen från SwapDeals medlemmar. Äkta recensioner från bytesupplevelser i Sverige.',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website'
  },
  about: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization'
  },
  breadcrumb: {
    '@id': 'https://swapdeals.se/alla-omdomen#breadcrumb'
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/testimonials-hero.webp',
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
