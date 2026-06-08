// app/hallbar-konsumtion/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: 'Hållbar Konsumtion | Eco Friendly Spelar Roll | SwapDeals',
  description: 'Lär dig varför hållbara byten spelar roll för miljön, din ekonomi och samhället. Minska avfall, spara pengar och bygg gemenskap genom smartare konsumtion. ✓ Eco Friendly ✓ Cirkulär Ekonomi ✓ Hållbart Liv',
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
  category: 'Sustainability Education',
  classification: 'Environmental Awareness and Sustainable Living',
  openGraph: {
    type: 'article',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/hallbar-konsumtion',
    siteName: 'SwapDeals',
    title: 'Hållbar Konsumtion - Varför Eco Friendly Spelar Roll',
    description: 'Upptäck hur hållbara byten kan minska avfall, spara pengar och bygga gemenskap. Lär dig varför eco friendly konsumtion spelar roll för vår planet och framtid.',
    images: [
      {
        url: '/sustainable-hero.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals - Hållbar Konsumtion och Eco Friendly Byten',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsUppsa',
    creator: '@SwapDealsUppsa',
    title: 'Hållbar Konsumtion - Varför Eco Friendly Spelar Roll | SwapDeals',
    description: 'Lär dig varför hållbara byten spelar roll. Minska avfall, spara pengar och bygg gemenskap genom smartare konsumtion.',
    images: {
      url: '/sustainable-hero.webp',
      alt: 'SwapDeals Hållbar Konsumtion'
    }
  },
  alternates: {
    canonical: 'https://swapdeals.se/hallbar-konsumtion',
    languages: {
      'sv-SE': 'https://swapdeals.se/hallbar-konsumtion',
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

// Article JSON-LD for sustainable consumption content
export const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': 'https://swapdeals.se/hallbar-konsumtion#article',
  headline: 'Varför Eco Friendly Spelar Roll—och Varför Nu',
  description: 'En omfattande guide om hållbar konsumtion, miljövänliga byten och hur du kan minska ditt miljöavtryck genom smartare konsumtionsval.',
  image: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/sustainable-hero.webp',
    width: 1200,
    height: 630
  },
  author: {
    '@type': 'Organization',
    name: 'SwapDeals',
    url: 'https://swapdeals.se'
  },
  publisher: {
    '@type': 'Organization',
    name: 'SwapDeals',
    logo: {
      '@type': 'ImageObject',
      url: 'https://swapdeals.se/icon.png',
      width: 512,
      height: 512
    }
  },
  datePublished: '2025-01-15T10:00:00Z',
  dateModified: '2025-01-15T10:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://swapdeals.se/hallbar-konsumtion'
  },
  articleSection: 'Sustainability',
 
  inLanguage: 'sv-SE'
};

// HowTo JSON-LD for sustainable living guide
export const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://swapdeals.se/hallbar-konsumtion#howto',
  name: 'Hur man lever mer hållbart genom byten',
  description: 'Steg-för-steg guide för att minska avfall och leva mer miljövänligt genom hållbara byten.',
  image: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/sustainable-hero.webp'
  },
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'SEK',
    value: '0'
  },
  step: [
    {
      '@type': 'HowToStep',
      name: 'Identifiera oanvända föremål',
      text: 'Gå igenom ditt hem och hitta saker du inte längre använder men som fortfarande är i gott skick.',
      position: 1
    },
    {
      '@type': 'HowToStep',
      name: 'Anslut till SwapDeals',
      text: 'Gå med i SwapDeals community för att hitta personer som vill byta varor istället för att köpa nytt.',
      position: 2
    },
    {
      '@type': 'HowToStep',
      name: 'Genomför byten',
      text: 'Byt dina oanvända föremål mot saker du faktiskt behöver, och minska avfall samtidigt.',
      position: 3
    },
    {
      '@type': 'HowToStep',
      name: 'Sprid budskapet',
      text: 'Uppmuntra andra att ansluta sig till den hållbara konsumtionsrörelsen.',
      position: 4
    }
  ]
};

// FAQ JSON-LD for sustainability questions
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/hallbar-konsumtion#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Varför är hållbar konsumtion viktig?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hållbar konsumtion är viktig för att minska miljöpåverkan, bevara naturresurser och bekämpa klimatförändringarna. Genom att byta istället för att köpa nytt håller vi föremål i användning längre och minskar behovet av tillverkning.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur kan jag börja leva mer eco friendly?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Börja med att byta saker du inte använder istället för att kasta dem. Anslut till SwapDeals för att hitta personer som vill byta varor. Välj återbruk och second hand före nyköp, och tänk på miljöpåverkan i dina köpbeslut.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur mycket pengar kan jag spara genom hållbara byten?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Genom att byta istället för att köpa nytt kan du spara tusentals kronor per år. Du undviker kostnader för nya produkter samtidigt som du ger dina oanvända saker värde genom byten.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vad är cirkulär ekonomi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cirkulär ekonomi innebär att hålla produkter och material i användning så länge som möjligt. Istället för att kasta och köpa nytt, återanvänder, reparerar och byter man varor för att minimera avfall och resursanvändning.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur påverkar byten miljön positivt?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Byten minskar efterfrågan på ny tillverkning, vilket sparar energi, vatten och råmaterial. Det minskar också mängden avfall som hamnar på soptippen och bidrar till lägre koldioxidutsläpp.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vem passar hållbara byten för?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Hållbara byten passar för alla studenter, familjer, minimalister och alla som vill leva smartare och mer miljövänligt. Det är en win-win-lösning för både plånbok och planet.'
      }
    }
  ]
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/hallbar-konsumtion#breadcrumb',
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
      name: 'Guider',
      item: 'https://swapdeals.se/guider'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Hållbar Konsumtion',
      item: 'https://swapdeals.se/hallbar-konsumtion'
    }
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/hallbar-konsumtion#webpage',
  url: 'https://swapdeals.se/hallbar-konsumtion',
  name: 'Hållbar Konsumtion - Varför Eco Friendly Spelar Roll',
  description: 'Lär dig varför hållbara byten spelar roll för miljön, ekonomin och samhället. Komplett guide för att minska avfall och leva mer miljövänligt.',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website',
    name: 'SwapDeals'
  },
  about: {
    '@type': 'Thing',
    name: 'Hållbar Konsumtion och Miljövänliga Byten'
  },
  breadcrumb: {
    '@id': 'https://swapdeals.se/hallbar-konsumtion#breadcrumb'
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/sustainable-hero.webp',
    width: 1200,
    height: 630
  },
  datePublished: '2025-01-15T10:00:00Z',
  dateModified: '2025-01-15T10:00:00Z',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization',
    name: 'SwapDeals'
  }
};

// Organization JSON-LD with sustainability focus
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://swapdeals.se#organization',
  name: 'SwapDeals',
  url: 'https://swapdeals.se',
  logo: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/icon.png',
    width: 512,
    height: 512
  },
  description: 'Community-driven bytesplattform för hållbar konsumtion i Sverige. Byt varor och tjänster, minska avfall och lev mer eco friendly.',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SE'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sweden',
    '@id': 'https://www.wikidata.org/wiki/Q34'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'info@swapdeals.se',
    availableLanguage: ['Swedish']
  },
  sameAs: [
    'https://www.facebook.com/swapdeals',
    'https://www.instagram.com/swapdeals',
    'https://twitter.com/SwapDealsUppsa'
  ]
};
