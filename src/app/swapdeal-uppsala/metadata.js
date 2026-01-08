// app/swapdeal-uppsala/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Uppsala | Hållbarhet | Second Hand Byten',
  
  description: 'Byt till dig saker som du behöver i Uppsala ✓ Kläder ✓ Elektronik ✓ Fordon ✓ Bra för mijön. Hitta annonser i Flogsta, Luthagen, Centrum & hela Uppsala. kostnadsfritt tjänst!',
  
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
    url: 'https://swapdeals.se/swapdeal-uppsala',
    siteName: 'SwapDeals',
    title: 'SwapDeals Uppsala - Byteshandel & Begagnade Prylar',
    description: 'Uppsalas största bytesplattform. Byt kläder, elektronik, möbler och mer helt gratis. Hållbart, lokalt och enkelt!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Uppsala - Byteshandel och begagnade prylar',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Uppsala - Byt Begagnade Prylar Gratis',
    description: 'Uppsalas ledande bytesplattform. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Uppsala'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-uppsala',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-uppsala',
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
    'geo.region': 'SE-C',
    'geo.placename': 'Uppsala',
    'geo.position': '59.8586;17.6389',
    'ICBM': '59.8586, 17.6389',
    'locality': 'Uppsala',
    'region': 'Uppsala län',
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
    'page-topic': 'Trading, E-commerce, Uppsala',
    'page-type': 'Local business page',
  }
};

// Local Business JSON-LD for Uppsala
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-uppsala#business',
  'name': 'SwapDeals Uppsala',
  'alternateName': 'SwapDeals',
  'url': 'https://swapdeals.se/swapdeal-uppsala',
  'description': 'Uppsalas ledande bytesplattform för begagnade varor. Byt kläder, elektronik, möbler och mer helt gratis.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Uppsala',
    'addressRegion': 'Uppsala län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 59.8586,
    'longitude': 17.6389
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Uppsala',
      '@id': 'https://www.wikidata.org/wiki/Q25411'
    },
    {
      '@type': 'City',
      'name': 'Centrum'
    },
    {
      '@type': 'City',
      'name': 'Flogsta'
    },
    {
      '@type': 'City',
      'name': 'Luthagen'
    },
    {
      '@type': 'City',
      'name': 'Svartbäcken'
    },
    {
      '@type': 'City',
      'name': 'Eriksberg'
    },
    {
      '@type': 'City',
      'name': 'Stenhagen'
    },
    {
      '@type': 'City',
      'name': 'Kungsängen'
    },
    {
      '@type': 'City',
      'name': 'Gottsunda'
    },
    {
      '@type': 'City',
      'name': 'Rickomberga'
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
  '@id': 'https://swapdeals.se/swapdeal-uppsala#webpage',
  'url': 'https://swapdeals.se/swapdeal-uppsala',
  'name': 'SwapDeals Uppsala - Byteshandel & Begagnade Prylar',
  'description': 'Uppsalas största bytesplattform. Byt begagnade prylar gratis.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-uppsala#business'
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
  '@id': 'https://swapdeals.se/swapdeal-uppsala#breadcrumb',
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
      'name': 'Uppsala',
      'item': 'https://swapdeals.se/swapdeal-uppsala'
    }
  ]
};

// FAQ JSON-LD for Uppsala
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-uppsala#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur fungerar byteshandel i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Uppsala kan du lägga upp bytesannonser helt gratis. Du väljer vad du vill byta bort och vad du söker. När någon i Uppsala är intresserad kontaktar ni varandra genom plattformen för att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka områden i Uppsala täcker SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals täcker hela Uppsala inklusive Centrum, Flogsta, Luthagen, Svartbäcken, Eriksberg, Stenhagen, Kungsängen, Gottsunda, Rickomberga och alla andra stadsdelar. Du kan enkelt filtrera annonser efter område för att hitta bytesmöjligheter nära dig i Uppsala.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad kan man byta i Uppsala på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta nästan vad som helst i Uppsala: kläder och mode, elektronik som mobiler och datorer, möbler och inredning, böcker och kurslitteratur, sport- och fritidsutrustning, studentprylar och hushållsartiklar. Så länge det är i gott skick och lagligt kan du byta det!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är det säkert att byta prylar med personer i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! Vi rekommenderar att alltid träffas på offentliga platser i Uppsala som caféer vid Fyristorg, Uppsala Centralstation, Gränby Centrum, universitetsbiblioteket Carolina Rediviva eller andra välbesökta områden. Kommunicera tydligt innan ni träffas och kolla användarens omdömen på plattformen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kostar det något att använda SwapDeals i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, SwapDeals är helt gratis att använda! Inga registreringsavgifter, inga dolda kostnader, inga provisioner. Du kan lägga upp obegränsat med bytesannonser och kontakta andra användare i Uppsala kostnadsfritt.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur hittar jag bytesannonser nära mig i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'När du söker på SwapDeals kan du filtrera annonser efter stadsdel och avstånd. På så sätt hittar du enkelt bytesmöjligheter i ditt närområde i Uppsala, oavsett om du bor i Flogsta, Luthagen, Centrum eller andra delar av staden.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka fördelar finns med lokal byteshandel i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lokal byteshandel i Uppsala innebär kortare resor, snabbare byten, möjlighet att träffa grannar och studenter, stöd till lokal gemenskap och mindre miljöpåverkan från transporter. Det är både praktiskt och hållbart att byta lokalt i Sveriges fjärde största stad!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är SwapDeals populärt bland studenter i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Absolut! Många studenter i Uppsala använder SwapDeals för att byta kurslitteratur, möbler, husgeråd och kläder. Det är perfekt för studenter som vill spara pengar och leva mer hållbart. Populära bytesområden inkluderar Flogsta, Studentstaden och Polacksbacken.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka är de bästa mötesplatserna för byteshandel i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Populära och säkra mötesplatser i Uppsala inkluderar Fyris Torg, Gränby Centrum, Uppsala Centralstation, Ekonomikum, Ångström Lab, Grand Hotell vid Floden och olika caféer i centrum. Välj alltid välbelyst och befolkat område för din trygghet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag byta kurslitteratur och studiematerial i Uppsala?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja, många studenter använder SwapDeals för att byta kurslitteratur och studiematerial! Det är ett smart sätt att få tag på böcker du behöver samtidigt som du blir av med böcker du inte längre använder. Ett perfekt alternativ till att köpa dyra nya böcker.'
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

// CollectionPage JSON-LD for Uppsala listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-uppsala#collection',
  'name': 'Bytesannonser i Uppsala',
  'description': 'Bläddra bland bytesannonser från Uppsalas olika stadsdelar',
  'url': 'https://swapdeals.se/swapdeal-uppsala',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Uppsala',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 59.8586,
      'longitude': 17.6389
    }
  }
};