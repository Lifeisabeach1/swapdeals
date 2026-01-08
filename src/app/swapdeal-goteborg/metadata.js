// app/swapdeal-goteborg/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Göteborg | Second Hand Marknad | Klimatsmart',
  
  description: 'Byt second hand prylar kostnadsfritt i Göteborg ✓ Kläder ✓ Elektronik ✓ Begagnade Möbler ✓ Genomtänkt byteshandel. Hitta bytesannonser nära dig i Göteborg. 100% gratis!',
  
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
    url: 'https://swapdeals.se/swapdeal-goteborg',
    siteName: 'SwapDeals',
    title: 'SwapDeals Göteborg - Byteshandel & Begagnade Prylar',
    description: 'Göteborgs största bytesplattform. Byt kläder, elektronik, möbler och mer helt gratis. Hållbart, lokalt och enkelt!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Göteborg - Byteshandel och begagnade prylar',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Göteborg - Byt Begagnade Prylar Gratis',
    description: 'Göteborgs ledande bytesplattform. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Göteborg'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-goteborg',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-goteborg',
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
    'geo.region': 'SE-O',
    'geo.placename': 'Göteborg',
    'geo.position': '57.7089;11.9746',
    'ICBM': '57.7089, 11.9746',
    'locality': 'Göteborg',
    'region': 'Västra Götalands län',
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
    'page-topic': 'Trading, E-commerce, Göteborg',
    'page-type': 'Local business page',
  }
};

// Local Business JSON-LD for Göteborg
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-goteborg#business',
  'name': 'SwapDeals Göteborg',
  'alternateName': 'SwapDeals',
  'url': 'https://swapdeals.se/swapdeal-goteborg',
  'description': 'Göteborgs ledande bytesplattform för begagnade varor. Byt kläder, elektronik, möbler och mer helt gratis.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Göteborg',
    'addressRegion': 'Västra Götalands län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 57.7089,
    'longitude': 11.9746
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Göteborg',
      '@id': 'https://www.wikidata.org/wiki/Q25287'
    },
    {
      '@type': 'City',
      'name': 'Majorna'
    },
    {
      '@type': 'City',
      'name': 'Haga'
    },
    {
      '@type': 'City',
      'name': 'Linnéstaden'
    },
    {
      '@type': 'City',
      'name': 'Landala'
    },
    {
      '@type': 'City',
      'name': 'Centrum'
    },
    {
      '@type': 'City',
      'name': 'Masthugget'
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
  '@id': 'https://swapdeals.se/swapdeal-goteborg#webpage',
  'url': 'https://swapdeals.se/swapdeal-goteborg',
  'name': 'SwapDeals Göteborg - Byteshandel & Begagnade Prylar',
  'description': 'Göteborgs största bytesplattform. Byt begagnade prylar gratis.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-goteborg#business'
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
  '@id': 'https://swapdeals.se/swapdeal-goteborg#breadcrumb',
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
      'name': 'Göteborg',
      'item': 'https://swapdeals.se/swapdeal-goteborg'
    }
  ]
};

// FAQ JSON-LD for Göteborg
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-goteborg#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur fungerar byteshandel i Göteborg?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Göteborg kan du lägga upp bytesannonser helt gratis. Du väljer vad du vill byta bort och vad du söker. När någon i Göteborg är intresserad kontaktar ni varandra genom plattformen för att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka områden i Göteborg täcker SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals täcker hela Göteborg inklusive Majorna, Haga, Linnéstaden, Landala, Centrum, Masthugget och alla andra stadsdelar. Du kan enkelt filtrera annonser efter område för att hitta bytesmöjligheter nära dig.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad kan man byta i Göteborg på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta nästan vad som helst: kläder och mode, elektronik som mobiler och datorer, möbler och inredning, böcker, sport- och fritidsutrustning, barnprylar och leksaker. Så länge det är i gott skick och lagligt kan du byta det!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är det säkert att byta prylar med personer i Göteborg?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! Vi rekommenderar att alltid träffas på offentliga platser i Göteborg som caféer, spårvagnshållplatser eller köpcentrum. Kommunicera tydligt innan ni träffas och kolla användarens omdömen på plattformen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kostar det något att använda SwapDeals i Göteborg?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, SwapDeals är helt gratis att använda! Inga registreringsavgifter, inga dolda kostnader, inga provisioner. Du kan lägga upp obegränsat med bytesannonser och kontakta andra användare kostnadsfritt.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur hittar jag bytesannonser nära mig i Göteborg?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'När du söker på SwapDeals kan du filtrera annonser efter stadsdel och avstånd. På så sätt hittar du enkelt bytesmöjligheter i ditt närområde i Göteborg, vilket gör det smidigt att träffas och genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka fördelar finns med lokal byteshandel i Göteborg?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lokal byteshandel i Göteborg innebär kortare resor, snabbare byten, möjlighet att träffa grannar, stöd till lokal gemenskap och mindre miljöpåverkan från transporter. Det är både praktiskt och hållbart!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag byta i hela Göteborgsområdet eller bara centralt?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du kan byta i hela Göteborgsområdet! SwapDeals täcker både innerstaden och förorter. Många användare är öppna för att träffas på bekväma mellanpunkter eller skicka varor med posten inom Göteborg eller i hela Sverige.'
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

// CollectionPage JSON-LD for Göteborg listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-goteborg#collection',
  'name': 'Bytesannonser i Göteborg',
  'description': 'Bläddra bland bytesannonser från Göteborgs olika stadsdelar',
  'url': 'https://swapdeals.se/swapdeal-goteborg',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Göteborg',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 57.7089,
      'longitude': 11.9746
    }
  }
};