// app/second-hand/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: 'Second Hand - Köp Begagnat & Spara Miljön | SwapDeals 2026',
  description: 'Allt om second hand shopping - fördelar, miljöpåverkan och hur du köper smart begagnat. Lär dig varför second hand är framtidens konsumtion. ✓ Miljövänligt ✓ Ekonomiskt ✓ Hållbart',
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
  category: 'Second Hand & Sustainable Consumption',
  classification: 'Circular Economy and Pre-owned Shopping',
  openGraph: {
    type: 'article',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/second-hand',
    siteName: 'SwapDeals',
    title: 'Second Hand Shopping - Den Ultimata Guiden till Begagnat',
    description: 'Omfattande guide om second hand shopping, miljöfördelar, ekonomiska besparingar och hur du hittar skatter bland begagnat. Framtidens smarta konsumtion.',
    images: [
      {
        url: '/second-hand.webp',
        width: 1200,
        height: 630,
        alt: 'Second Hand Shopping - Hållbar och miljövänlig konsumtion',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsUppsa',
    creator: '@SwapDealsUppsa',
    title: 'Second Hand Shopping - Den Ultimata Guiden | SwapDeals',
    description: 'Allt om second hand - miljöfördelar, ekonomiska besparingar och hur du blir en expert på begagnat. Framtidens smartare konsumtion.',
    images: {
      url: '/second-hand.webp',
      alt: 'SwapDeals Second Hand Guide'
    }
  },
  alternates: {
    canonical: 'https://swapdeals.se/second-hand',
    languages: {
      'sv-SE': 'https://swapdeals.se/second-hand',
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

// Article JSON-LD for second hand blog post
export const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': 'https://swapdeals.se/second-hand#article',
  headline: 'Second Hand - Den ultimata guiden till begagnat shopping',
  alternativeHeadline: 'Varför second hand är framtidens smartare konsumtion',
  description: 'En omfattande guide om second hand shopping, miljöfördelar, ekonomiska besparingar, kvalitetstips och hur du blir expert på att hitta skatter bland begagnat.',
  image: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/second-hand.webp',
    width: 1200,
    height: 630,
    caption: 'Second hand shopping - Hållbar och miljövänlig konsumtion för framtiden'
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
  datePublished: '2026-01-05T10:00:00Z',
  dateModified: '2026-01-05T10:00:00Z',
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://swapdeals.se/second-hand'
  },
  articleSection: 'Second Hand & Circular Economy',
  keywords: 'second hand, begagnat, loppis, återanvändning, cirkulär ekonomi, hållbar konsumtion, vintage, retro, miljövänligt, ekonomiskt, second hand shopping, begagnade kläder',
  wordCount: 4800,
  inLanguage: 'sv-SE',
  about: [
    {
      '@type': 'Thing',
      name: 'Second Hand Shopping'
    },
    {
      '@type': 'Thing',
      name: 'Återanvändning'
    },
    {
      '@type': 'Thing',
      name: 'Cirkulär ekonomi'
    },
    {
      '@type': 'Thing',
      name: 'Hållbar konsumtion'
    }
  ]
};

// HowTo JSON-LD for second hand shopping tips
export const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  '@id': 'https://swapdeals.se/second-hand#howto',
  name: 'Hur du shoppar smart second hand',
  description: 'Konkreta steg för att bli expert på second hand shopping - från att hitta de bästa platserna till att bedöma kvalitet och hitta riktiga fynd.',
  image: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/second-hand.webp'
  },
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'SEK',
    value: '0'
  },
  totalTime: 'PT2H',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Hitta de bästa second hand-platserna',
      text: 'Utforska lokala loppmarknader, second hand-butiker, online-marknadsplatser som SwapDeals, Tradera och Facebook Marketplace. Varje plats har sina unika fynd.',
      position: 1
    },
    {
      '@type': 'HowToStep',
      name: 'Inspektera kvaliteten noggrant',
      text: 'Kontrollera sömmar, dragkedjor, fläckar och slitage. Lukta på textilier, testa funktioner och var kritisk. Kvalitet är viktigare än pris.',
      position: 2
    },
    {
      '@type': 'HowToStep',
      name: 'Känna igen värdefulla märken',
      text: 'Lär dig känna igen kvalitetsmärken inom mode, möbler och elektronik. Vintage designer-plagg kan vara riktiga fynd på second hand.',
      position: 3
    },
    {
      '@type': 'HowToStep',
      name: 'Förhandla smart',
      text: 'På loppmarknader är priser ofta förhandlingsbara. Var vänlig men bestämd, och kom med rimliga motbud baserade på skick.',
      position: 4
    },
    {
      '@type': 'HowToStep',
      name: 'Tvätta och renovera',
      text: 'Tvätta textilier ordentligt, rengör möbler och överväg små reparationer. Många second hand-fynd blir som nya med lite kärlek.',
      position: 5
    },
    {
      '@type': 'HowToStep',
      name: 'Sälj vidare det du inte behöver',
      text: 'Använd SwapDeals eller andra plattformar för att sälja eller byta saker du inte längre använder. Håll cirkeln levande!',
      position: 6
    }
  ]
};

// FAQ JSON-LD for second hand questions
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/second-hand#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Varför ska jag köpa second hand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Second hand shopping minskar miljöpåverkan dramatiskt - textilproduktion står för 10% av globala koldioxidutsläpp. Att köpa begagnat sparar resurser, minskar avfall och kan spara dig 50-90% jämfört med nytt. Plus att du hittar unika fynd som ingen annan har.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur mycket kan jag spara genom att köpa second hand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Du kan spara 50-90% jämfört med nypris på de flesta produkter. En second hand-garderob kan spara dig 10 000-50 000 kr per år. Möbler, elektronik och barnprodukter ger särskilt stora besparingar.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur vet jag att second hand-produkter har bra kvalitet?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Inspektera alltid noggrant: kolla sömmar, dragkedjor, fläckar och funktion. Fråga om historik. Köp från betrodda säljare. På SwapDeals kan du se säljarens omdömen och historik. Kvalitetsmärken håller ofta bättre över tid.'
      }
    },
    {
      '@type': 'Question',
      name: 'Var kan jag köpa second hand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I Sverige finns många second hand-butiker som Myrorna, Stadsmissionen, Erikshjälpen och Röda Korset. Online kan du använda SwapDeals för lokala bytesaffärer, samt Tradera, Blocket och Facebook Marketplace.'
      }
    },
    {
      '@type': 'Question',
      name: 'Är second hand verkligen bättre för miljön?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, definitivt! Att köpa second hand förlänger produkters livslängd och minskar behovet av nyproduktion. En second hand t-shirt sparar 2 700 liter vatten och 6 kg koldioxidutsläpp. Textilåtervinning minskar avfall med 95%.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vilka produkter är bäst att köpa second hand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Bäst värde får du på kläder, möbler, böcker, sportutrustning, barnprodukter, verktyg och köksartiklar. Kvalitetsvaror från kända märken behåller värdet bättre. Undvik elektronik utan garanti och säkerhetsutrustning.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur tvättar jag second hand-kläder säkert?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tvätta alltid second hand-textilier innan första användningen. Använd varmt vatten (minst 60°C) om tyget tål det, eller frys plagget i 48 timmar för att döda eventuella skadedjur. Lufta ordentligt efter tvätt.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kan jag hitta märkeskläder på second hand?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolut! Second hand är ett guldläge för designerkläder och kvalitetsmärken till bråkdelen av nypriset. Var tålmodig, lär dig känna igen äkta produkter och besök regelbundet för att hitta de bästa fynden.'
      }
    }
  ]
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/second-hand#breadcrumb',
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
      name: 'Second Hand - Den Ultimata Guiden',
      item: 'https://swapdeals.se/second-hand'
    }
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/second-hand#webpage',
  url: 'https://swapdeals.se/second-hand',
  name: 'Second Hand - Den Ultimata Guiden till Begagnat Shopping',
  description: 'Omfattande guide om second hand shopping, miljöfördelar, ekonomiska besparingar och hur du blir expert på att hitta skatter bland begagnat.',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website',
    name: 'SwapDeals'
  },
  about: {
    '@type': 'Thing',
    name: 'Second Hand Shopping och Cirkulär Ekonomi'
  },
  breadcrumb: {
    '@id': 'https://swapdeals.se/second-hand#breadcrumb'
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/second-hand.webp',
    width: 1200,
    height: 630
  },
  datePublished: '2026-01-05T10:00:00Z',
  dateModified: '2026-01-05T10:00:00Z',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization',
    name: 'SwapDeals'
  }
};

// Organization JSON-LD with second hand focus
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
  description: 'Community-driven bytesplattform för second hand och hållbar konsumtion i Sverige. Främjar cirkulär ekonomi genom smart återanvändning och byteshandel.',
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
    'https://twitter.com/SwapDealsUppsa'
  ],
  knowsAbout: [
    'Second Hand Shopping',
    'Begagnat',
    'Cirkulär ekonomi',
    'Återanvändning',
    'Hållbar konsumtion',
    'Vintage',
    'Loppmarknader'
  ]
};