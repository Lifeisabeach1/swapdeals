// app/swapdeal-malmö/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Malmö | Byt Begagnat | Hållbarhet',
  
  description: 'Byt begagnade second hand saker i Malmö ✓ Begagnade Kläder ✓ Elektronik ✓ Möbler ✓ Miljövänlig byteshandel. Hitta bytesannonser i Möllevången, Västra Hamnen & hela Malmö. gratis tjänst',
  
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
    url: 'https://swapdeals.se/swapdeal-malmo',
    siteName: 'SwapDeals',
    title: 'SwapDeals Malmö - Byteshandel & Begagnade Prylar',
    description: 'Malmös största bytesplattform. Byt kläder, elektronik, möbler och mer helt gratis. Hållbart, lokalt och enkelt!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Malmö - Byteshandel och begagnade prylar',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Malmö - Byt Begagnade Prylar Gratis',
    description: 'Malmös ledande bytesplattform. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Malmö'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-malmo',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-malmo',
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
    'geo.region': 'SE-M',
    'geo.placename': 'Malmö',
    'geo.position': '55.6050;13.0038',
    'ICBM': '55.6050, 13.0038',
    'locality': 'Malmö',
    'region': 'Skåne län',
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
    'page-topic': 'Trading, E-commerce, Malmö',
    'page-type': 'Local business page',
  }
};

// Local Business JSON-LD for Malmö
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-malmo#business',
  'name': 'SwapDeals Malmö',
  'alternateName': 'SwapDeals',
  'url': 'https://swapdeals.se/swapdeal-malmo',
  'description': 'Malmös ledande bytesplattform för begagnade varor. Byt kläder, elektronik, möbler och mer helt gratis.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Malmö',
    'addressRegion': 'Skåne län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 55.6050,
    'longitude': 13.0038
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Malmö',
      '@id': 'https://www.wikidata.org/wiki/Q1960'
    },
    {
      '@type': 'City',
      'name': 'Möllevången'
    },
    {
      '@type': 'City',
      'name': 'Västra Hamnen'
    },
    {
      '@type': 'City',
      'name': 'Rosengård'
    },
    {
      '@type': 'City',
      'name': 'Limhamn'
    },
    {
      '@type': 'City',
      'name': 'Centrum'
    },
    {
      '@type': 'City',
      'name': 'Kirseberg'
    },
    {
      '@type': 'City',
      'name': 'Husie'
    },
    {
      '@type': 'City',
      'name': 'Oxie'
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
  '@id': 'https://swapdeals.se/swapdeal-malmo#webpage',
  'url': 'https://swapdeals.se/swapdeal-malmo',
  'name': 'SwapDeals Malmö - Byteshandel & Begagnade Prylar',
  'description': 'Malmös största bytesplattform. Byt begagnade prylar gratis.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-malmo#business'
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
  '@id': 'https://swapdeals.se/swapdeal-malmo#breadcrumb',
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
      'name': 'Malmö',
      'item': 'https://swapdeals.se/swapdeal-malmo'
    }
  ]
};

// FAQ JSON-LD for Malmö
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-malmo#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur fungerar byteshandel i Malmö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Malmö kan du lägga upp bytesannonser helt gratis. Du väljer vad du vill byta bort och vad du söker. När någon i Malmö är intresserad kontaktar ni varandra genom plattformen för att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka områden i Malmö täcker SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals täcker hela Malmö inklusive Möllevången, Västra Hamnen, Rosengård, Limhamn, Kirseberg, Centrum, Husie, Oxie och alla andra stadsdelar. Du kan enkelt filtrera annonser efter område för att hitta bytesmöjligheter nära dig i Malmö.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad kan man byta i Malmö på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta nästan vad som helst i Malmö: kläder och mode, elektronik som mobiler och datorer, möbler och inredning, böcker, sport- och fritidsutrustning, barnprylar och leksaker. Så länge det är i gott skick och lagligt kan du byta det!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är det säkert att byta prylar med personer i Malmö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! Vi rekommenderar att alltid träffas på offentliga platser i Malmö som caféer i Möllevången, Triangeln köpcentrum, Västra Hamnen eller andra välbesökta områden. Kommunicera tydligt innan ni träffas och kolla användarens omdömen på plattformen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kostar det något att använda SwapDeals i Malmö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, SwapDeals är helt gratis att använda! Inga registreringsavgifter, inga dolda kostnader, inga provisioner. Du kan lägga upp obegränsat med bytesannonser och kontakta andra användare i Malmö kostnadsfritt.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur hittar jag bytesannonser nära mig i Malmö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'När du söker på SwapDeals kan du filtrera annonser efter stadsdel och avstånd. På så sätt hittar du enkelt bytesmöjligheter i ditt närområde i Malmö, oavsett om du bor i Möllevången, Limhamn, Västra Hamnen eller andra delar av staden.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka fördelar finns med lokal byteshandel i Malmö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lokal byteshandel i Malmö innebär kortare resor, snabbare byten, möjlighet att träffa grannar, stöd till lokal gemenskap och mindre miljöpåverkan från transporter. Det är både praktiskt och hållbart att byta lokalt i Sveriges tredje största stad!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag byta med personer över Öresundsbron?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! Många användare i Malmö är öppna för att byta med personer i Köpenhamn och Öresundsregionen. Du kan också välja att bara byta lokalt i Malmö eller skicka varor med posten inom Sverige. Flexibiliteten är stor på SwapDeals!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka är de bästa mötesplatserna för byteshandel i Malmö?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Populära och säkra mötesplatser i Malmö inkluderar Triangeln köpcentrum, Möllevångstorget, Västra Hamnen, Malmö Centralstation, Emporia köpcentrum och olika caféer i centrum. Välj alltid välbelyst och befolkat område för din trygghet.'
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

// CollectionPage JSON-LD for Malmö listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-malmo#collection',
  'name': 'Bytesannonser i Malmö',
  'description': 'Bläddra bland bytesannonser från Malmös olika stadsdelar',
  'url': 'https://swapdeals.se/swapdeal-malmo',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Malmö',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 55.6050,
      'longitude': 13.0038
    }
  }
};