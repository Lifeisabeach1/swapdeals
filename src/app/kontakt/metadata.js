// app/kontakt/metadata.js

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: 'Kontakta Oss | Etisk Handel | SwapDeals',
  description: 'Har du frågor om SwapDeals? Kontakta oss för hjälp med byteshandel, teknisk support eller feedback. ✓ Svar inom 24h ✓ Rikstäckande tjänst ✓ Hållbar byteshandel',
  authors: [{ name: 'SwapDeals', url: 'https://swapdeals.se' }],
  creator: 'SwapDeals',
  publisher: 'SwapDeas',
  applicationName: 'SwapDeals',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  category: 'Customer Support',
  classification: 'Contact and Customer Service',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se/kontakt',
    siteName: 'SwapDeals',
    title: 'Kontakta SwapDeals | Kundservice & Support',
    description: 'Behöver du hjälp med SwapDeals? Kontakta oss för frågor om byteshandel, teknisk support eller feedback. Vi svarar inom 24 timmar.',
    images: [
      {
        url: '/contact-hero.webp',
        width: 1200,
        height: 630,
        alt: 'Kontakta SwapDeals - Kundservice och Support',
        type: 'image/webp'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsUppsa',
    creator: '@SwapDealsUppsa',
    title: 'Kontakta SwapDeals | Kundservice',
    description: 'Har du frågor om SwapDeals? Kontakta oss för hjälp med byteshandel och teknisk support. Vi svarar inom 24 timmar.',
    images: {
      url: '/contact-hero.webp',
      alt: 'SwapDeals Kundservice'
    }
  },
  alternates: {
    canonical: 'https://swapdeals.se/kontakt',
    languages: {
      'sv-SE': 'https://swapdeals.se/kontakt',
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
    'contact': 'kontakt@swapdeals.se',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals',
    'theme-color': '#10b981',
    'msapplication-TileColor': '#10b981',
  }
};

// Organization JSON-LD with contact information
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
  description: 'SwapDeals gör det enkelt att byta begagnade varor på ett hållbart sätt i hela Sverige.',
  email: 'kontakt@swapdeals.se',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SE'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Sweden',
    '@id': 'https://www.wikidata.org/wiki/Q34'
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'kontakt@swapdeals.se',
      availableLanguage: ['Swedish'],
      areaServed: 'SE',
      serviceArea: {
        '@type': 'Country',
        name: 'Sweden'
      }
    }
  ],
  sameAs: [
    'https://www.facebook.com/swapdeals',
    'https://www.instagram.com/swapdeals',
    'https://twitter.com/SwapDealsUppsa'
  ],
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Uppsala',
      addressCountry: 'SE'
    }
  }
};

// ContactPage JSON-LD
export const contactPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://swapdeals.se/kontakt#contactpage',
  name: 'Kontakta SwapDeals',
  description: 'Kontakta SwapDeals för frågor om byteshandel, teknisk support eller feedback. Vi svarar inom 24 timmar.',
  url: 'https://swapdeals.se/kontakt',
  inLanguage: 'sv-SE',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization'
  }
};

// FAQ JSON-LD for contact page
export const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://swapdeals.se/kontakt#faq',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Hur fungerar SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SwapDeals gör det enkelt att byta begagnade varor. Skapa ett konto, lägg upp dina saker och börja handla med andra användare för en mer hållbar framtid.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kostar det något att använda SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nej, SwapDeals är helt gratis att använda. Precis som byteshandel fungerade för länge sedan kostar det inget att byta saker här.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur snabbt får jag svar på mina frågor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vi strävar efter att svara på alla förfrågningar inom 24 timmar på vardagar. För brådskande frågor kan du kontakta oss direkt via e-post på kontakt@swapdeals.se.'
      }
    },
    {
      '@type': 'Question',
      name: 'Kan jag föreslå nya funktioner för SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Absolut! Vi värdesätter feedback från våra användare. Skicka dina förslag till oss via kontaktformuläret eller e-post så tittar vi på möjligheten att implementera dem.'
      }
    },
    {
      '@type': 'Question',
      name: 'Hur kontaktar jag SwapDeals support?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Du kan kontakta oss via kontaktformuläret på denna sida eller direkt via e-post på kontakt@swapdeals.se. Vi svarar inom 24 timmar på vardagar.'
      }
    },
    {
      '@type': 'Question',
      name: 'Vilka områden täcker SwapDeals?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SwapDeals är en rikstäckande tjänst som är tillgänglig i hela Sverige.'
      }
    }
  ]
};

// Breadcrumb JSON-LD
export const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': 'https://swapdeals.se/kontakt#breadcrumb',
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
      name: 'Kontakt',
      item: 'https://swapdeals.se/kontakt'
    }
  ]
};

// WebPage JSON-LD
export const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://swapdeals.se/kontakt#webpage',
  url: 'https://swapdeals.se/kontakt',
  name: 'Kontakta Oss | SwapDeals',
  description: 'Kontakta SwapDeals för frågor om byteshandel, teknisk support eller feedback. Vi svarar inom 24 timmar.',
  inLanguage: 'sv-SE',
  isPartOf: {
    '@type': 'WebSite',
    '@id': 'https://swapdeals.se#website',
    name: 'SwapDeals',
    url: 'https://swapdeals.se'
  },
  about: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization'
  },
  breadcrumb: {
    '@id': 'https://swapdeals.se/kontakt#breadcrumb'
  },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://swapdeals.se/contact-hero.webp',
    width: 1200,
    height: 630
  },
  datePublished: '2025-01-02T10:00:00Z',
  dateModified: '2025-01-02T10:00:00Z',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization'
  },
  mainEntity: {
    '@type': 'ContactPage',
    '@id': 'https://swapdeals.se/kontakt#contactpage'
  }
};

// Website JSON-LD
export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://swapdeals.se#website',
  name: 'SwapDeals',
  url: 'https://swapdeals.se',
  description: 'Sveriges ledande plattform för hållbar byteshandel. Byt begagnade varor enkelt och säkert.',
  inLanguage: 'sv-SE',
  publisher: {
    '@type': 'Organization',
    '@id': 'https://swapdeals.se#organization'
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://swapdeals.se/search?q={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};
