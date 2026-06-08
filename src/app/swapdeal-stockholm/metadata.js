// app/swapdeal-stockholm/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Stockholm | Hållbar Konsumtion | Bortskänkes',
  
  description: 'Byt det du har mot det du vill ha i Stockholm ✓ Kläder ✓ Leksaker ✓ Fordon ✓ Bra för samhället. Hitta bytesannonser nära dig i Stockholm. Gratis tjänst',
  
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
    url: 'https://swapdeals.se/swapdeal-stockholm',
    siteName: 'SwapDeals',
    title: 'SwapDeals Stockholm - Byteshandel & Begagnade Prylar',
    description: 'Stockholms största bytesplattform. Byt kläder, elektronik, möbler och mer helt gratis. Hållbart, lokalt och enkelt!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Stockholm - Byteshandel och begagnade prylar',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Stockholm - Byt Begagnade Prylar Gratis',
    description: 'Stockholms ledande bytesplattform. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Stockholm'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-stockholm',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-stockholm',
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
    'geo.region': 'SE-AB',
    'geo.placename': 'Stockholm',
    'geo.position': '59.3293;18.0686',
    'ICBM': '59.3293, 18.0686',
    'locality': 'Stockholm',
    'region': 'Stockholm län',
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
    'page-topic': 'Trading, E-commerce, Stockholm',
    'page-type': 'Local business page',
  }
};

// Local Business JSON-LD for Stockholm
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-stockholm#business',
  'name': 'SwapDeals Stockholm',
  'alternateName': 'SwapDeals',
  'url': 'https://swapdeals.se/swapdeal-stockholm',
  'description': 'Stockholms ledande bytesplattform för begagnade varor. Byt kläder, elektronik, möbler och mer helt gratis.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Stockholm',
    'addressRegion': 'Stockholm län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 59.3293,
    'longitude': 18.0686
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Stockholm',
      '@id': 'https://www.wikidata.org/wiki/Q1754'
    },
    {
      '@type': 'City',
      'name': 'Södermalm'
    },
    {
      '@type': 'City',
      'name': 'Vasastan'
    },
    {
      '@type': 'City',
      'name': 'Östermalm'
    },
    {
      '@type': 'City',
      'name': 'Kungsholmen'
    },
    {
      '@type': 'City',
      'name': 'Norrmalm'
    },
    {
      '@type': 'City',
      'name': 'Gamla Stan'
    }
  ],
  'priceRange': 'Gratis',
  'currenciesAccepted': 'SEK',
  'paymentAccepted': 'None - Free Trading',
  'email': 'support@swapdeals.se',
  'sameAs': [
    'https://www.facebook.com/swapdeals',
    'https://www.instagram.com/swapdeals.se/',
    'https://twitter.com/SwapDealsSE',
    'https://www.tiktok.com/@swapdeals'
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/swapdeal-stockholm#webpage',
  'url': 'https://swapdeals.se/swapdeal-stockholm',
  'name': 'SwapDeals Stockholm - Byteshandel & Begagnade Prylar',
  'description': 'Stockholms största bytesplattform. Byt begagnade prylar gratis.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-stockholm#business'
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
  '@id': 'https://swapdeals.se/swapdeal-stockholm#breadcrumb',
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
      'name': 'Stockholm',
      'item': 'https://swapdeals.se/swapdeal-stockholm'
    }
  ]
};

// FAQ JSON-LD for Stockholm
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-stockholm#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur fungerar byteshandel i Stockholm?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Stockholm kan du lägga upp bytesannonser helt gratis. Du väljer vad du vill byta bort och vad du söker. När någon i Stockholm är intresserad kontaktar ni varandra genom plattformen för att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka områden i Stockholm täcker SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals täcker hela Stockholm inklusive Södermalm, Vasastan, Östermalm, Kungsholmen, Norrmalm, Gamla Stan och alla andra stadsdelar. Du kan enkelt filtrera annonser efter område för att hitta bytesmöjligheter nära dig.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad kan man byta i Stockholm på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta nästan vad som helst: kläder och mode, elektronik som mobiler och datorer, möbler och inredning, böcker, sport- och fritidsutrustning, barnprylar och leksaker. Så länge det är i gott skick och lagligt kan du byta det!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är det säkert att byta prylar med personer i Stockholm?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! Vi rekommenderar att alltid träffas på offentliga platser i Stockholm som caféer, tunnelbanestationer eller köpcentrum. Kommunicera tydligt innan ni träffas och kolla användarens omdömen på plattformen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kostar det något att använda SwapDeals i Stockholm?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, SwapDeals är helt gratis att använda! Inga registreringsavgifter, inga dolda kostnader, inga provisioner. Du kan lägga upp obegränsat med bytesannonser och kontakta andra användare kostnadsfritt.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur hittar jag bytesannonser nära mig i Stockholm?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'När du söker på SwapDeals kan du filtrera annonser efter stadsdel och avstånd. På så sätt hittar du enkelt bytesmöjligheter i ditt närområde i Stockholm, vilket gör det smidigt att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka fördelar finns med lokal byteshandel i Stockholm?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lokal byteshandel i Stockholm innebär kortare resor, snabbare byten, möjlighet att träffa grannar, stöd till lokal gemenskap och mindre miljöpåverkan från transporter. Det är både praktiskt och hållbart!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag byta i hela Stockholmsområdet eller bara centralt?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta i hela Stockholmsområdet! SwapDeals täcker både innerstaden och förorter. Många användare är öppna för att träffas på bekväma mellanpunkter eller skicka varor med posten inom Stockholm.'
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
    
    
    'https://twitter.com/SwapDealsSE',
    
  ]
};

// CollectionPage JSON-LD for Stockholm listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-stockholm#collection',
  'name': 'Bytesannonser i Stockholm',
  'description': 'Bläddra bland bytesannonser från Stockholms olika stadsdelar',
  'url': 'https://swapdeals.se/swapdeal-stockholm',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Stockholm',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 59.3293,
      'longitude': 18.0686
    }
  }
};
