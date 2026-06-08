// app/swapdeal-västerås/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Västerås | Second Hand Fynd | Hållbart',
  
  description: 'Byt second hand i Västerås ✓ Begagnade möbler ✓ Vintage-kläder ✓ Elektronik ✓ Lokal byteshandel Hälla, Bäckby, City. Hållbar handel i Mälardalen gratis plattform',
  
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
  
  category: 'E-commerce & Sustainable Trading',
  classification: 'Local Trading Platform',
  
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/swapdeal-vasteras',
    siteName: 'SwapDeals',
    title: 'SwapDeals Västerås - Lokal Byteshandel i Mälardalen',
    description: 'Västerås lokal bytesplattform. Byt second hand möbler, kläder, elektronik gratis. Hållbar handel i Mälardalen!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Västerås - Byteshandel second hand begagnat Mälardalen',
        type: 'image/webp'
      }
    ],
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals Västerås - Byteshandel Begagnat i Mälardalen',
    description: 'Västerås ledande plattform för byteshandel. Byt second hand möbler, vintage-kläder, elektronik helt gratis!',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Västerås lokal byteshandel'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeal-vasteras',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeal-vasteras',
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
    'geo.region': 'SE-U',
    'geo.placename': 'Västerås',
    'geo.position': '59.6099;16.5448',
    'ICBM': '59.6099, 16.5448',
    'locality': 'Västerås',
    'region': 'Västmanlands län',
    'country-name': 'Sweden',
    'language': 'sv-SE',
    'content-language': 'sv-SE',
    'contact': 'support@swapdeals.se',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals',
    'theme-color': '#3b82f6',
    'msapplication-TileColor': '#3b82f6',
    'msapplication-navbutton-color': '#3b82f6',
    'application-name': 'SwapDeals',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'copyright': 'SwapDeals',
    'author': 'SwapDeals',
    'revisit-after': '5 days',
    'distribution': 'global',
    'audience': 'all',
    'page-topic': 'Trading, E-commerce, Västerås, Mälardalen',
    'page-type': 'Local business directory',
  }
};

// Local Business JSON-LD for Västerås
export const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://swapdeals.se/swapdeal-vasteras#business',
  'name': 'SwapDeals Västerås',
  'alternateName': ['SwapDeals Mälardalen', 'Byteshandel Västerås'],
  'url': 'https://swapdeals.se/swapdeal-vasteras',
  'description': 'Västerås lokala bytesplattform för second hand och begagnade varor. Byt möbler, vintage-kläder, elektronik helt gratis i Mälardalen.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'address': {
    '@type': 'PostalAddress',
    'addressLocality': 'Västerås',
    'addressRegion': 'Västmanlands län',
    'addressCountry': 'SE'
  },
  'geo': {
    '@type': 'GeoCoordinates',
    'latitude': 59.6099,
    'longitude': 16.5448
  },
  'areaServed': [
    {
      '@type': 'City',
      'name': 'Västerås',
      '@id': 'https://www.wikidata.org/wiki/Q25501'
    },
    {
      '@type': 'Place',
      'name': 'Hälla'
    },
    {
      '@type': 'Place',
      'name': 'Bäckby'
    },
    {
      '@type': 'Place',
      'name': 'Västerås City'
    },
    {
      '@type': 'Place',
      'name': 'Biskopsgården'
    },
    {
      '@type': 'Place',
      'name': 'Erikslund'
    },
    {
      '@type': 'Place',
      'name': 'Vallby'
    },
    {
      '@type': 'Place',
      'name': 'Skiljebo'
    },
    {
      '@type': 'Place',
      'name': 'Tillberga'
    },
    {
      '@type': 'Place',
      'name': 'Lundby'
    },
    {
      '@type': 'City',
      'name': 'Mälardalen'
    }
  ],
  'priceRange': 'Gratis',
  'currenciesAccepted': 'SEK',
  'paymentAccepted': 'Ingen kostnad - Gratis byteshandel',
  'email': 'support@swapdeals.se',
  'sameAs': [
    'https://twitter.com/SwapDealsSE',
    
  
  ],
  'slogan': 'Västerås lokala bytesplattform - Hållbar handel i Mälardalen'
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/swapdeal-vasteras#webpage',
  'url': 'https://swapdeals.se/swapdeal-vasteras',
  'name': 'SwapDeals Västerås - Byteshandel Second Hand i Mälardalen',
  'description': 'Västerås största bytesplattform för begagnade varor. Byt second hand gratis lokalt.',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@id': 'https://swapdeals.se/swapdeal-vasteras#business'
  },
  'inLanguage': 'sv-SE',
  'primaryImageOfPage': {
    '@type': 'ImageObject',
    'url': 'https://swapdeals.se/bytaprylar.webp',
    'width': 1200,
    'height': 630
  },
  'datePublished': '2025-01-15T12:00:00Z',
  'dateModified': '2025-01-15T12:00:00Z',
  'potentialAction': {
    '@type': 'TradeAction',
    'target': {
      '@type': 'EntryPoint',
      'urlTemplate': 'https://swapdeals.se/tradeform',
      'actionPlatform': [
        'http://schema.org/DesktopWebPlatform',
        'http://schema.org/MobileWebPlatform'
      ]
    }
  }
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/swapdeal-vasteras#breadcrumb',
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
      'name': 'Västerås',
      'item': 'https://swapdeals.se/swapdeal-vasteras'
    }
  ]
};

// FAQ JSON-LD for Västerås
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeal-vasteras#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur fungerar byteshandel i Västerås på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Västerås skapar du gratis bytesannonser. Du listar vad du vill byta bort och anger vad du söker. När någon i Västerås (Hälla, Bäckby, City etc) är intresserad, kontaktar ni varandra via plattformen och bestämmer en säker mötesplats i Västerås för att genomföra bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vilka områden i Västerås täcker SwapDeals byteshandel?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals täcker hela Västerås inkluderat Hälla, Bäckby, Västerås City, Biskopsgården, Erikslund, Vallby, Skiljebo, Tillberga, Lundby och alla andra områden. Du kan filtrera bytesannonser efter område för att hitta byten nära dig i Västerås eller Mälardalen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad kan jag byta i Västerås på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals Västerås kan du byta: second hand möbler och inredning, vintage-kläder och modeaccessoarer, hemelektronik (mobiler, datorer, TV), böcker och media, sport- och fritidsutrustning, barnkläder och leksaker. Allt som är i gott skick och lagligt att sälja/byta kan bytas!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Är byteshandel säkert i Västerås?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja! För säker byteshandel i Västerås rekommenderar vi att träffas på offentliga platser som Punkt köpcentrum, Västerås City, kaféer på Vasagatan, Erikslund Shopping eller andra välbesökta områden. Kontrollera alltid föremålet innan byte och läs användaromdömen på SwapDeals.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kostar SwapDeals något att använda i Västerås?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, SwapDeals är 100% gratis! Inga registreringsavgifter, inga dolda kostnader, inga provisioner på byten. Du kan skapa obegränsat med bytesannonser och kontakta andra användare i Västerås helt kostnadsfritt. Endast ren byteshandel utan pengar.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur hittar jag bytesannonser nära mig i Västerås?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'På SwapDeals kan du använda sökfilter för att hitta bytesannonser i specifika områden i Västerås (Hälla, Bäckby, City, etc) och sortera efter avstånd. På så sätt hittar du snabbt bytesmöjligheter nära ditt hem i Västerås eller Mälardalen.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Varför välja lokal byteshandel i Västerås?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Lokal byteshandel i Västerås ger: kortare resor och snabbare byten, möjlighet att träffa grannar och bygga community, minskad miljöpåverkan, stöd till cirkulär ekonomi i Mälardalen. Det är både praktiskt, hållbart och kostnadseffektivt att byta lokalt i Västerås!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag byta med personer i andra Mälarstäder?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Absolut! Många användare är öppna för byten med folk från närliggande städer som Eskilstuna, Köping, Enköping eller andra delar av Mälardalen. Du kan också välja postbyten inom Sverige eller fokusera endast på lokal byteshandel i Västerås. Flexibiliteten är stor på SwapDeals!'
      }
    },
    {
      '@type': 'Question',
      'name': 'Var är bästa ställena att träffas för byteshandel i Västerås?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Säkra och populära mötesplatser för byteshandel i Västerås: Punkt köpcentrum, Erikslund Shopping, Västerås City/Vasagatan, Västerås Centralstation, ICA Maxi Hälla, kaféer i centrum. Välj alltid välbelyst, offentligt och välbesökt område för trygg byteshandel.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur bidrar byteshandel till hållbarhet i Västerås?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Byteshandel i Västerås främjar cirkulär ekonomi genom att: förlänga produkters livscykel, minska nyproduktion och resurskonsumtion, skära ner avfall och sopbergen, stödja lokal och hållbar konsumtion i Mälardalen. Varje byte är ett steg mot en grönare framtid för Västerås!'
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
  'description': 'Sveriges ledande bytesplattform för hållbar konsumtion och cirkulär ekonomi. Byt second hand helt gratis i hela Sverige.',
  'contactPoint': {
    '@type': 'ContactPoint',
    'contactType': 'Kundsupport',
    'email': 'support@swapdeals.se',
    'availableLanguage': ['Swedish', 'Svenska']
  },
  'sameAs': [
  

    'https://twitter.com/SwapDealsSE',
  
  ],
  'founder': {
    '@type': 'Organization',
    'name': 'SwapDeals'
  }
};

// CollectionPage JSON-LD for Västerås listings
export const collectionPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://swapdeals.se/swapdeal-vasteras#collection',
  'name': 'Bytesannonser i Västerås och Mälardalen',
  'description': 'Utforska second hand bytesannonser från Västerås olika stadsdelar: Hälla, Bäckby, City och resten av Mälardalen',
  'url': 'https://swapdeals.se/swapdeal-vasteras',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'about': {
    '@type': 'Place',
    'name': 'Västerås',
    'alternateName': 'Mälardalen',
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 59.6099,
      'longitude': 16.5448
    }
  },
  'hasPart': [
    {
      '@type': 'WebPage',
      'name': 'Byteshandel Hälla',
      'description': 'Second hand byten i Hälla, Västerås'
    },
    {
      '@type': 'WebPage',
      'name': 'Byteshandel Bäckby',
      'description': 'Begagnade varor byteshandel i Bäckby'
    },
    {
      '@type': 'WebPage',
      'name': 'Byteshandel Västerås City',
      'description': 'Lokal byteshandel centrum Västerås'
    }
  ]
};

// Service JSON-LD
export const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': 'https://swapdeals.se/swapdeal-vasteras#service',
  'serviceType': 'Byteshandel och Second Hand Plattform',
  'provider': {
    '@id': 'https://swapdeals.se#organization'
  },
  'areaServed': {
    '@type': 'City',
    'name': 'Västerås',
    '@id': 'https://www.wikidata.org/wiki/Q25501'
  },
  'hasOfferCatalog': {
    '@type': 'OfferCatalog',
    'name': 'Byteshandel Kategorier Västerås',
    'itemListElement': [
      {
        '@type': 'OfferCatalog',
        'name': 'Second Hand Möbler',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Begagnade möbler byteshandel Västerås'
            }
          }
        ]
      },
      {
        '@type': 'OfferCatalog',
        'name': 'Vintage Kläder',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Second hand kläder byteshandel Västerås'
            }
          }
        ]
      },
      {
        '@type': 'OfferCatalog',
        'name': 'Hemelektronik',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Product',
              'name': 'Begagnad elektronik byteshandel Västerås'
            }
          }
        ]
      }
    ]
  },
  'offers': {
    '@type': 'Offer',
    'price': '0',
    'priceCurrency': 'SEK',
    'availability': 'https://schema.org/InStock',
    'description': 'Helt gratis byteshandel i Västerås - ingen kostnad'
  }
};
