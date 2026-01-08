// app/swapdeal-linköping/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Linköping | Miljövänligt | Second Hand Varor',
  
  description: 'Byt begagnade prylar gratis i Linköping ✓ Kläder ✓ Elektronik ✓ Möbler ✓ Hållbar byteshandel. Hitta bytesannonser i Centrum, Ryd & hela Linköping. 100% kostnadsfritt!',
  
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
  
  category: 'E-commerce & Trading',
  classification: 'Online Trading Platform',
  
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/swapdeal-linkoping',
    siteName: 'SwapDeals',
    title: 'SwapDeals Linköping - Byteshandel & Begagnade Prylar',
    description: 'Linköpings största bytesplattform. Byt kläder, elektronik, möbler och mer helt gratis. Hållbart, lokalt och enkelt!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Linköping - Byteshandel och begagnade prylar',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Linköping - Byt Begagnade Prylar Gratis',
    description: 'Linköpings ledande bytesplattform. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Linköping'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-linkoping',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-linkoping',
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
  
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  
  other: {
    'geo.region': 'SE-E',
    'geo.placename': 'Linköping',
    'geo.position': '58.4108;15.6214',
    'ICBM': '58.4108, 15.6214',
    'locality': 'Linköping',
    'region': 'Östergötlands län',
    'country-name': 'Sweden',
    'language': 'sv-SE',
    'content-language': 'sv-SE',
    'contact': 'support@swapdeals.se',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals',
    'theme-color': '#10b981',
    'msapplication-TileColor': '#10b981',
    'msapplication-navbutton-color': '#10b981',
    'application-name': 'SwapDeals',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'copyright': 'SwapDeals',
    'author': 'SwapDeals',
    'revisit-after': '7 days',
    'distribution': 'global',
    'audience': 'all',
    'page-topic': 'Trading, E-commerce, Linköping',
    'page-type': 'Local business page',
  }
};

// Local Business JSON-LD for Linköping
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-linkoping#business',
  'name': 'SwapDeals Linköping',
  'alternateName': 'SwapDeals',
  'url': 'https://swapdeals.se/swapdeal-linkoping',
  'description': 'Linköpings ledande bytesplattform för begagnade varor. Byt kläder, elektronik, möbler och mer helt gratis.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Linköping',
    'addressRegion': 'Östergötlands län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 58.4108,
    'longitude': 15.6214
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Linköping',
      '@id': 'https://www.wikidata.org/wiki/Q25434'
    },
    {
      '@type': 'City',
      'name': 'Ryd'
    },
    {
      '@type': 'City',
      'name': 'Centrum'
    },
    {
      '@type': 'City',
      'name': 'Skäggetorp'
    },
    {
      '@type': 'City',
      'name': 'Lambohov'
    },
    {
      '@type': 'City',
      'name': 'Universitetsområdet'
    },
    {
      '@type': 'City',
      'name': 'Tornby'
    },
    {
      '@type': 'City',
      'name': 'Johannelund'
    },
    {
      '@type': 'City',
      'name': 'Berga'
    }
  ],
  'priceRange': 'Gratis',
  'currenciesAccepted': 'SEK',
  'paymentAccepted': 'None - Free Trading',
  'email': 'support@swapdeals.se',
  'sameAs': [
    'https://twitter.com/SwapDealsSE',
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/swapdeal-linkoping#webpage',
  'url': 'https://swapdeals.se/swapdeal-linkoping',
  'name': 'SwapDeals Linköping - Byteshandel & Begagnade Prylar',
  'description': 'Linköpings största bytesplattform. Byt begagnade prylar gratis.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-linkoping#business'
  },
  'inLanguage': 'sv-SE',
  'primaryImageOfPage': {
    '@type': 'ImageObject',
    'url': 'https://swapdeals.se/bytaprylar.webp',
    'width': 1200,
    'height': 630
  },
  'datePublished': '2025-01-15T10:00:00Z',
  'dateModified': '2025-01-15T10:00:00Z'
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/swapdeal-linkoping#breadcrumb',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Hem',
      'item': 'https://swapdeals.se'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Städer',
      'item': 'https://swapdeals.se/stader'
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': 'Linköping',
      'item': 'https://swapdeals.se/swapdeal-linkoping'
    }
  ]
};

// FAQ JSON-LD for Linköping
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-linkoping#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur fungerar byteshandel i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Linköping kan du lägga upp bytesannonser helt gratis. Du väljer vad du vill byta bort och vad du söker. När någon i Linköping är intresserad kontaktar ni varandra genom plattformen för att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka områden i Linköping täcker SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals täcker hela Linköping inklusive Ryd, Centrum, Skäggetorp, Lambohov, Universitetsområdet, Tornby, Johannelund, Berga och alla andra stadsdelar. Du kan enkelt filtrera annonser efter område för att hitta bytesmöjligheter nära dig i Linköping.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad kan man byta i Linköping på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta nästan vad som helst i Linköping: kläder och mode, elektronik som mobiler och datorer, möbler och inredning, böcker, sport- och fritidsutrustning, barnprylar och leksaker. Så länge det är i gott skick och lagligt kan du byta det!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är det säkert att byta prylar med personer i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! Vi rekommenderar att alltid träffas på offentliga platser i Linköping som caféer i Centrum, Tornby köpcentrum, Universitetsområdet eller andra välbesökta områden. Kommunicera tydligt innan ni träffas och kolla användarens omdömen på plattformen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kostar det något att använda SwapDeals i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, SwapDeals är helt gratis att använda! Inga registreringsavgifter, inga dolda kostnader, inga provisioner. Du kan lägga upp obegränsat med bytesannonser och kontakta andra användare i Linköping kostnadsfritt.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur hittar jag bytesannonser nära mig i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'När du söker på SwapDeals kan du filtrera annonser efter stadsdel och avstånd. På så sätt hittar du enkelt bytesmöjligheter i ditt närområde i Linköping, oavsett om du bor i Ryd, Lambohov, Skäggetorp eller andra delar av staden.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka fördelar finns med lokal byteshandel i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lokal byteshandel i Linköping innebär kortare resor, snabbare byten, möjlighet att träffa grannar, stöd till lokal gemenskap och mindre miljöpåverkan från transporter. Det är både praktiskt och hållbart att byta lokalt i universitets- och teknikstaden!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är SwapDeals populärt bland studenter i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! SwapDeals är särskilt populärt bland studenter vid Linköpings universitet och tekniska högskola. Det är ett perfekt sätt att möblera studentrummet, byta kurslitteratur och hitta prylar till studentbudget - helt gratis!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka är de bästa mötesplatserna för byteshandel i Linköping?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Populära och säkra mötesplatser i Linköping inkluderar Tornby köpcentrum, Linköpings centralstation, Universitetsområdet, Stångån/centrum, olika caféer i centrum och studentkåren. Välj alltid välbelyst och befolkat område för din trygghet.'
      }
    }
  ]
};

// Organization JSON-LD
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://swapdeals.se#organization',
  'name': 'SwapDeals',
  'url': 'https://swapdeals.se',
  'logo': {
    '@type': 'ImageObject',
    'url': 'https://swapdeals.se/bytaprylar.webp',
    'width': 512,
    'height': 512
  },
  'description': 'Sveriges ledande bytesplattform för hållbar konsumtion. Byt begagnade varor gratis i hela Sverige.',
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'Customer Service',
    'email': 'support@swapdeals.se',
    'availableLanguage': ['Swedish']
  },
  'sameAs': [
    'https://www.facebook.com/swapdeals',
    'https://www.instagram.com/swapdeals.se/',
    'https://twitter.com/SwapDealsSE',
    'https://www.tiktok.com/@swapdeals'
  ]
};

// CollectionPage JSON-LD for Linköping listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-linkoping#collection',
  'name': 'Bytesannonser i Linköping',
  'description': 'Bläddra bland bytesannonser från Linköpings olika stadsdelar',
  'url': 'https://swapdeals.se/swapdeal-linkoping',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Linköping',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 58.4108,
      'longitude': 15.6214
    }
  }
};