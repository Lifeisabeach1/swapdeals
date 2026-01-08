// app/hallbarhet/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: 'Hållbarhet är Viktigare än Någonsin | SwapDeals 2026',
  description: 'Hållbarhet vad kan man göra & Varför hållbarhet är avgörande för vår framtid. Lär dig om klimatkrisen, cirkulär ekonomi, social rättvisa och hur du kan göra skillnad idag. ✓ Klimat ✓ Miljö ✓ Hållbart Liv',
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
  category: 'Sustainability & Climate Action',
  classification: 'Environmental Education and Climate Awareness',
  openGraph: {
    type: 'article',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/hallbarhet',
    siteName: 'SwapDeals',
    title: 'Varför Hållbarhet är Viktigare än Någonsin - En Guide till Hållbar Framtid',
    description: 'Omfattande guide om klimatkrisen, miljöförstöring, cirkulär ekonomi och social hållbarhet. Lär dig hur du kan göra skillnad idag för en bättre framtid.',
    images: [
      {
        url: '/hallbarhet.webp',
        width: 1200,
        height: 630,
        alt: 'Hållbarhet - Händer som håller jorden med förnybar energi',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsUppsa',
    creator: '@SwapDealsUppsa',
    title: 'Varför Hållbarhet är Viktigare än Någonsin | SwapDeals',
    description: 'Omfattande guide om klimatkrisen, miljö och hur du kan göra skillnad. Från klimatfakta till konkreta handlingar för en hållbar framtid.',
    images: {
      url: '/hallbarhet.webp',
      alt: 'SwapDeals Hållbarhetsguide'
    }
  },
  alternates: {
    canonical: 'https://swapdeals.se/hallbarhet',
    languages: {
      'sv-SE': 'https://swapdeals.se/hallbarhet',
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
    'geo.region': 'SE-C',
    'geo.placename': 'Uppsala',
    'geo.position': '59.8586;17.6389',
    'ICBM': '59.8586, 17.6389',
    'locality': 'Uppsala',
    'region': 'Uppsala län',
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

// Article JSON-LD for sustainability blog post
export const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': 'https://swapdeals.se/hallbarhet#article',
  headline: 'Varför hållbarhet är viktigare än någonsin',
  alternativeHeadline: 'Vår planets framtid börjar med våra val idag',
  description: 'En omfattande guide om klimatkrisen, miljöförstöring, ekonomiska perspektiv på hållbarhet, social rättvisa och konkreta handlingar för en hållbar framtid.',
  image: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/hallbarhet',
    width: 1200,
    height: 630,
    caption: 'Händer som håller jorden med förnybar energi och hållbar framtid'
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
  datePublished: '2026-01-03T10:00:00Z',
  dateModified: '2026-01-03T10:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://swapdeals.se/hallbarhet'
  },
  articleSection: 'Sustainability & Climate',
  keywords: 'hållbarhet, klimatkris, miljö, cirkulär ekonomi, social hållbarhet, klimatförändringar, förnybar energi, hållbar konsumtion, ekologisk hållbarhet',
  wordCount: 5200,
  inLanguage: 'sv-SE',
  about: [
    {
      '@type': 'Thing',
      name: 'Klimatförändringar'
    },
    {
      '@type': 'Thing',
      name: 'Miljöskydd'
    },
    {
      '@type': 'Thing',
      name: 'Hållbar utveckling'
    },
    {
      '@type': 'Thing',
      name: 'Cirkulär ekonomi'
    }
  ]
};

// HowTo JSON-LD for sustainable living actions
export const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://swapdeals.se/hallbarhet#howto',
  name: 'Hur du kan leva mer hållbart idag',
  description: 'Konkreta steg för att minska ditt miljöavtryck och leva mer hållbart genom energieffektivisering, hållbar transport, mat och konsumtion.',
  image: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/hallbarhet.png'
  },
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'SEK',
    value: '0'
  },
  totalTime: 'P1D',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Energieffektivisera ditt hem',
      text: 'Byt till LED-lampor, installera termostatventiler och förbättra isoleringen för att minska energiförbrukningen med upp till 50%.',
      position: 1
    },
    {
      '@type': 'HowToStep',
      name: 'Välj hållbar transport',
      text: 'Prioritera cykel, gång och kollektivtrafik. Om du behöver bil, överväg elbil eller bildelning för att minska utsläppen.',
      position: 2
    },
    {
      '@type': 'HowToStep',
      name: 'Ändra dina matvanor',
      text: 'Minska köttkonsumtionen, välj lokalt och säsongsanpassat, och minimera matsvinn genom smart planering.',
      position: 3
    },
    {
      '@type': 'HowToStep',
      name: 'Konsumera hållbart',
      text: 'Köp mindre men bättre kvalitet, välj second hand när möjligt, och byt saker du inte använder på SwapDeals.',
      position: 4
    },
    {
      '@type': 'HowToStep',
      name: 'Engagera dig politiskt',
      text: 'Gå med i miljöorganisationer, kontakta politiker och sprid kunskap om hållbarhet i ditt nätverk.',
      position: 5
    }
  ]
};

// FAQ JSON-LD for sustainability questions
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/hallbarhet#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Varför är hållbarhet viktigare nu än någonsin?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vi befinner oss mitt i en klimatkris där de globala temperaturerna har stigit 1,1 grader Celsius jämfört med förindustriell tid. Varje år, månad och dag räknas - ju längre vi väntar, desto svårare blir omställningen och desto allvarligare blir konsekvenserna för framtida generationer.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur påverkar klimatförändringarna oss idag?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Klimatförändringarna orsakar redan rekordvarma temperaturer, extrema översvämningar, torka, värmebölgor och hotade ekosystem. Korallrev dör, glaciärer krymper och över 1 miljon arter riskerar utrotning. De senaste åtta åren har varit de varmaste någonsin uppmätta.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vad är cirkulär ekonomi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cirkulär ekonomi innebär att hålla produkter och resurser i användning så länge som möjligt genom återanvändning, reparation och återvinning. Det kan generera 4,5 biljoner dollar i ekonomisk aktivitet till 2030 samtidigt som det minskar avfall och resursförbrukning.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur mycket kan jag spara genom att leva hållbart?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Energieffektivisering kan minska energikostnaderna med 20-50%. En person som cyklar istället för att köra bil sparar 1-2 ton CO2 per år. Att minska köttkonsumtionen och välja second hand kan spara tusentals kronor årligen.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vad är social hållbarhet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Social hållbarhet handlar om rättvis fördelning av resurser, jämställdhet, arbetarrätt, hälsa och utbildning. Det innebär att den gröna omställningen måste vara inkluderande och rättvis, där ingen lämnas efter.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur kan jag göra störst skillnad som individ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'De mest effektiva åtgärderna är att minska köttkonsumtionen, välja hållbar transport som cykel eller kollektivtrafik, energieffektivisera ditt hem, konsumera mindre och smartare, samt engagera dig politiskt för systemförändringar.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kostar det mer att leva hållbart?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nej, många hållbara val sparar faktiskt pengar. Företag med stark hållbarhetsprofil har 18% högre lönsamhet. Kostnaden för att agera mot klimatförändringarna är endast 1-2% av global BNP, medan kostnaden för inaktivitet kan uppgå till 5-20%.'
      }
    }
  ]
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/hallbarhet#breadcrumb',
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
      name: 'Blogg',
      item: 'https://swapdeals.se/blogg'
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Varför Hållbarhet är Viktigare än Någonsin',
      item: 'https://swapdeals.se/hallbarhet'
    }
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/hallbarhet#webpage',
  url: 'https://swapdeals.se/hallbarhet',
  name: 'Varför Hållbarhet är Viktigare än Någonsin',
  description: 'Omfattande guide om klimatkrisen, miljöförstöring, cirkulär ekonomi, social hållbarhet och konkreta handlingar för en hållbar framtid.',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website',
    name: 'SwapDeals'
  },
  about: {
    '@type': 'Thing',
    name: 'Hållbarhet och Klimatåtgärder'
  },
  breadcrumb: {
    '@id': 'https://swapdeals.se/hallbarhet#breadcrumb'
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/hallbarhet.webp',
    width: 1200,
    height: 630
  },
  datePublished: '2026-01-03T10:00:00Z',
  dateModified: '2026-01-03T10:00:00Z',
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
  description: 'Community-driven bytesplattform för hållbar konsumtion i Uppsala. Främjar cirkulär ekonomi och minskar miljöpåverkan genom smartare konsumtion.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Uppsala',
    addressRegion: 'Uppsala län',
    postalCode: '753 10',
    addressCountry: 'SE'
  },
  areaServed: {
    '@type': 'City',
    name: 'Uppsala',
    '@id': 'https://www.wikidata.org/wiki/Q25286'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    email: 'info@swapdeals.se',
    availableLanguage: ['Swedish']
  },
  sameAs: [
   
    'https://twitter.com/SwapDealsUppsa'
  ],
  knowsAbout: [
    'Hållbar konsumtion',
    'Cirkulär ekonomi',
    'Klimatåtgärder',
    'Miljöskydd',
    'Återanvändning',
    'Second Hand'
  ]
};