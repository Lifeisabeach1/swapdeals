// app/swapdeal-orebro/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Örebro | Begagnat Byt Eller Ge bort',
  
  description: 'Byt second hand prylar kostnadsfritt i Örebro ✓ Begagnade Kläder ✓ Begagnad Elektronik ✓ Begagnade Möbler ✓ Genomtänkt byteshandel. Hitta bytesannonser nära dig i Örebro. 100% gratis!',
  
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
    url: 'https://swapdeals.se/swapdeal-orebro',
    siteName: 'SwapDeals',
    title: 'SwapDeals Örebro - Byteshandel & Begagnade Prylar',
    description: 'Örebros största bytesplattform. Byt kläder, elektronik, möbler och mer helt gratis. Hållbart, lokalt och enkelt!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Örebro - Byteshandel och begagnade prylar',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Örebro - Byt Begagnade Prylar Gratis',
    description: 'Örebros ledande bytesplattform. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Örebro'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-orebro',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-orebro',
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
    'geo.region': 'SE-T',
    'geo.placename': 'Örebro',
    'geo.position': '59.2753;15.2134',
    'ICBM': '59.2753, 15.2134',
    'locality': 'Örebro',
    'region': 'Örebro län',
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
    'page-topic': 'Trading, E-commerce, Örebro',
    'page-type': 'Local business page',
  }
};

// Local Business JSON-LD for Örebro
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-orebro#business',
  'name': 'SwapDeals Örebro',
  'alternateName': 'SwapDeals',
  'url': 'https://swapdeals.se/swapdeal-orebro',
  'description': 'Örebros ledande bytesplattform för begagnade varor. Byt kläder, elektronik, möbler och mer helt gratis.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Örebro',
    'addressRegion': 'Örebro län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 59.2753,
    'longitude': 15.2134
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Örebro',
      '@id': 'https://www.wikidata.org/wiki/Q25748'
    },
    {
      '@type': 'City',
      'name': 'Vivalla'
    },
    {
      '@type': 'City',
      'name': 'Ladugårdsängen'
    },
    {
      '@type': 'City',
      'name': 'Centrum'
    },
    {
      '@type': 'City',
      'name': 'Brickebacken'
    },
    {
      '@type': 'City',
      'name': 'Hovsta'
    },
    {
      '@type': 'City',
      'name': 'Karlslund'
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
  '@id': 'https://swapdeals.se/swapdeal-orebro#webpage',
  'url': 'https://swapdeals.se/swapdeal-orebro',
  'name': 'SwapDeals Örebro - Byteshandel & Begagnade Prylar',
  'description': 'Örebros största bytesplattform. Byt begagnade prylar gratis.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-orebro#business'
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
  '@id': 'https://swapdeals.se/swapdeal-orebro#breadcrumb',
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
      'name': 'Örebro',
      'item': 'https://swapdeals.se/swapdeal-orebro'
    }
  ]
};

// FAQ JSON-LD for Örebro
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-orebro#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Varför ska jag välja SwapDeals för byteshandel i Örebro?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals är Örebros mest etablerade bytesplattform där du träffar lokala bytespartners. Du slipper både pengatransaktioner och osäkra möten eftersom du kan se användaromdömen och träffa folk från ditt eget område. Dessutom är det 100% gratis att använda!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur lång tid tar det innan jag hittar någon att byta med i Örebro?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Det beror på vad du erbjuder och söker, men många användare i Örebro får kontakt inom några dagar. Populära kategorier som kläder, elektronik och barnartiklar brukar generera snabb respons. Tips: Lägg upp tydliga foton och beskrivningar för bästa resultat!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag byta fler än en sak åt gången på SwapDeals Örebro?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Absolut! Många örebroare skapar "bytespaket" där de byter flera föremål samtidigt. Det är särskilt populärt för barnkläder, böcker och inredningsdetaljer. Du kan förhandla fritt med din bytespartner om vad som passar er bäst.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka är de mest populära byteskategorierna i Örebro?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'I Örebro är kläder och mode, barnartiklar, elektronik, möbler och sportprylar de mest bytesfrekventa kategorierna. Många örebroare byter även böcker, trädgårdsredskap och hushållsartiklar. SwapDeals täcker i princip alla vardagliga föremål!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Måste jag registrera mig för att byta i Örebro?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja, en enkel registrering krävs för att kunna lägga upp annonser och kontakta andra användare. Detta skapar en tryggare miljö där alla bytespartners är verifierade. Registreringen tar bara några minuter och är helt kostnadsfri.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Var är de bästa platserna att träffas för byte i Örebro?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Populära och säkra mötesplatser i Örebro inkluderar Köpmangatan, Stortorget, bibliotek, köpcentrum som Krämaren och Eurostop, samt caféer i centrum. Välj alltid offentliga platser med mycket folk och dagsljus för maximal trygghet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad händer om jag inte är nöjd med ett byte?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Vi rekommenderar alltid att noggrant inspektera föremål innan byte. Kommunicera öppet med din bytespartner om förväntningar och skick. SwapDeals uppmuntrar ärliga beskrivningar och kan hjälpa till att medla vid eventuella konflikter, men byten sker på egen risk.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur bidrar byteshandel i Örebro till en bättre miljö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Varje byte minskar behovet av nyproduktion, vilket sparar resurser, energi och minskar utsläpp. När du byter lokalt i Örebro undviker du dessutom långa transporter. Byteshandel förlänger produkters livslängd och är ett kraftfullt sätt att leva mer hållbart!'
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

// CollectionPage JSON-LD for Örebro listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-orebro#collection',
  'name': 'Bytesannonser i Örebro',
  'description': 'Bläddra bland bytesannonser från Örebros olika stadsdelar',
  'url': 'https://swapdeals.se/swapdeal-orebro',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Örebro',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 59.2753,
      'longitude': 15.2134
    }
  }
};
