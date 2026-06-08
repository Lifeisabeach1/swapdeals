// app/swapdeals-guide/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: 'SwapDeals Guide | Bytes annonser | Second Hand',
  
  description: 'Komplett guide till byteshandel på SwapDeals ✓ Lär dig byta kläder, möbler & elektronik gratis ✓ 6 enkla steg ✓ Tips för framgångsrika byten ✓ Säker & hållbar handel i Sverige',
  
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
  
  category: 'Education & Guide',
  classification: 'Trading Guide & Tutorial',
  
  openGraph: {
    type: 'article',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/swapdeals-guide',
    siteName: 'SwapDeals',
    title: 'Komplett Guide till Byteshandel | SwapDeals',
    description: 'Lär dig byta begagnade prylar framgångsrikt! 6 enkla steg, expertips och säkerhetsråd för hållbar byteshandel i Sverige.',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals Guide - Lär dig byteshandel steg för steg',
        type: 'image/webp'
      }
    ],
    article: {
      publishedTime: '2025-01-15T10:00:00Z',
      modifiedTime: '2025-01-15T10:00:00Z',
      section: 'Guide & Tutorial',
      tags: [
        'Byteshandel',
        'Hållbarhet',
        'Cirkulär Ekonomi',
        'Gratis Byteshandel',
        'Second Hand',
        'Miljövänligt'
      ]
    }
  },
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'Komplett Guide till Byteshandel | SwapDeals',
    description: 'Lär dig byta begagnade prylar framgångsrikt! 6 enkla steg och expertips.',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals Guide'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se/swapdeals-guide',
    languages: {
      'sv-SE': 'https://swapdeals.se/swapdeals-guide',
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
    'language': 'sv-SE',
    'content-language': 'sv-SE',
    'contact': 'support@swapdeals.se',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals Guide',
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
    'page-topic': 'Guide, Tutorial, Trading Education',
    'page-type': 'Educational Guide',
  }
};

// HowTo JSON-LD for Guide
export const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://swapdeals.se/swapdeals-guide#howto',
  'name': 'Hur man byter begagnade prylar på SwapDeals',
  'description': 'Komplett steg-för-steg guide till framgångsrik byteshandel på SwapDeals plattform',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'totalTime': 'PT30M',
  'estimatedCost': {
    '@type': 'MonetaryAmount',
    'currency': 'SEK',
    'value': '0'
  },
  'supply': [
    {
      '@type': 'HowToSupply',
      'name': 'Begagnade föremål att byta'
    },
    {
      '@type': 'HowToSupply',
      'name': 'Kamera eller smartphone för foton'
    },
    {
      '@type': 'HowToSupply',
      'name': 'SwapDeals-konto'
    }
  ],
  'tool': [
    {
      '@type': 'HowToTool',
      'name': 'SwapDeals plattform'
    }
  ],
  'step': [
    {
      '@type': 'HowToStep',
      'position': 1,
      'name': 'Lägg upp dina föremål',
      'text': 'Ta högkvalitativa foton och beskriv föremålet noggrant. Specificera önskade bytesobjekt.',
      'url': 'https://swapdeals.se/swapdeals-guide#steg1',
      'image': 'https://swapdeals.se/bytaprylar.webp'
    },
    {
      '@type': 'HowToStep',
      'position': 2,
      'name': 'Ta emot byteserbjudanden',
      'text': 'Få realtidsnotiser när användare föreslår byten. Jämför flera erbjudanden.',
      'url': 'https://swapdeals.se/swapdeals-guide#steg2',
      'image': 'https://swapdeals.se/bytaprylar.webp'
    },
    {
      '@type': 'HowToStep',
      'position': 3,
      'name': 'Utvärdera och besluta',
      'text': 'Acceptera, avvisa eller förhandla om erbjudanden. Du har full kontroll.',
      'url': 'https://swapdeals.se/swapdeals-guide#steg3',
      'image': 'https://swapdeals.se/bytaprylar.webp'
    },
    {
      '@type': 'HowToStep',
      'position': 4,
      'name': 'Kommunicera säkert',
      'text': 'Använd den inbyggda chatten för att planera mötet. Bestäm plats och tid.',
      'url': 'https://swapdeals.se/swapdeals-guide#steg4',
      'image': 'https://swapdeals.se/bytaprylar.webp'
    },
    {
      '@type': 'HowToStep',
      'position': 5,
      'name': 'Slutför bytet',
      'text': 'Träffas på offentlig plats, inspektera föremålen och genomför bytet.',
      'url': 'https://swapdeals.se/swapdeals-guide#steg5',
      'image': 'https://swapdeals.se/bytaprylar.webp'
    },
    {
      '@type': 'HowToStep',
      'position': 6,
      'name': 'Följ din bytesresa',
      'text': 'Markera bytet som genomfört och ge betyg. Bygg ditt rykte i communityt.',
      'url': 'https://swapdeals.se/swapdeals-guide#steg6',
      'image': 'https://swapdeals.se/bytaprylar.webp'
    }
  ]
};

// Article JSON-LD
export const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': 'https://swapdeals.se/swapdeals-guide#article',
  'headline': 'Komplett Guide till Byteshandel på SwapDeals - 6 Enkla Steg',
  'description': 'Lär dig hur du byter begagnade prylar framgångsrikt på SwapDeals. Steg-för-steg guide med tips för säker och hållbar byteshandel.',
  'image': 'https://swapdeals.se/bytaprylar.webp',
  'author': {
    '@type': 'Organization',
    'name': 'SwapDeals',
    'url': 'https://swapdeals.se'
  },
  'publisher': {
    '@type': 'Organization',
    'name': 'SwapDeals',
    'logo': {
      '@type': 'ImageObject',
      'url': 'https://swapdeals.se/bytaprylar.webp'
    }
  },
  'datePublished': '2025-01-15T10:00:00Z',
  'dateModified': '2025-01-15T10:00:00Z',
  'mainEntityOfPage': {
    '@type': 'WebPage',
    '@id': 'https://swapdeals.se/swapdeals-guide'
  },
  
  'articleSection': 'Guide & Tutorial',
  'inLanguage': 'sv-SE'
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/swapdeals-guide#webpage',
  'url': 'https://swapdeals.se/swapdeals-guide',
  'name': 'SwapDeals Guide - Lär dig byteshandel steg för steg',
  'description': 'Komplett guide till framgångsrik byteshandel på SwapDeals',
  'isPartOf': {
    '@id': 'https://swapdeals.se#website'
  },
  'inLanguage': 'sv-SE',
  'primaryImageOfPage': {
    '@type': 'ImageObject',
    'url': 'https://swapdeals.se/bytaprylar.webp',
    'width': 1200,
    'height': 630
  },
  'datePublished': '2025-01-15T10:00:00Z',
  'dateModified': '2025-01-15T10:00:00Z',
  'breadcrumb': {
    '@id': 'https://swapdeals.se/swapdeals-guide#breadcrumb'
  }
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/swapdeals-guide#breadcrumb',
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
      'name': 'SwapDeals Guide',
      'item': 'https://swapdeals.se/swapdeals-guide'
    }
  ]
};

// FAQ JSON-LD
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/swapdeals-guide#faq',
  'mainEntity': [
    {
      '@type': 'Question',
      'name': 'Hur lång tid tar det att genomföra ett byte på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'De flesta framgångsrika byten genomförs inom 3-7 dagar efter att annonsen publicerats. Själva bytesprocessen från accepterat erbjudande till genomfört byte tar vanligtvis 1-3 dagar beroende på avstånd och tillgänglighet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad ska jag tänka på när jag fotograferar mina föremål?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ta foton i naturligt dagsljus från minst 3-4 olika vinklar. Visa tydligt eventuella defekter eller slitage. Professionella bilder ökar chansen att få attraktiva byteserbjudanden med upp till 300%.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur säkert är det att byta prylar med främmande personer?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals prioriterar säkerhet. Möts alltid på offentliga platser med god belysning, kontrollera användarens betyg och historik före bytet, och lita på din magkänsla. Använd den inbyggda chattfunktionen för all kommunikation.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag ångra mig efter att jag accepterat ett byteserbjudande?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Ja, du har full flexibilitet och kan ändra dig när som helst innan bytet är genomfört. Det är dock viktigt att kommunicera tydligt med den andra parten om du väljer att avbryta.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Hur bygger jag ett gott rykte på SwapDeals?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Bygg rykte genom att genomföra byten framgångsrikt, svara snabbt på meddelanden, vara ärlig i dina beskrivningar, hålla överenskomna tider och ge konstruktiv feedback. Aktiva användare med komplett historik får i genomsnitt 40% fler erbjudanden.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Måste jag byta mot samma typ av föremål?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Nej, du kan byta vad som helst mot vad som helst! Du kan till exempel byta kläder mot elektronik eller möbler mot böcker. Det enda som spelar roll är att båda parter är nöjda med bytet.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Vad händer om föremålet inte matchar beskrivningen när vi möts?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'Du är aldrig skyldig att genomföra ett byte om föremålet inte matchar beskrivningen. Inspektera alltid noggrant innan ni byter, och rapportera vilseledande annonser till SwapDeals säkerhetsavdelning.'
      }
    },
    {
      '@type': 'Question',
      'name': 'Kan jag använda SwapDeals för företagsbyten?',
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': 'SwapDeals är primärt designat för privatpersoner, men företag är välkomna att använda plattformen för att byta begagnad kontorsutrustning, inventarier och andra företagsrelaterade föremål.'
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
  'description': 'Sveriges ledande bytesplattform för hållbar konsumtion',
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
