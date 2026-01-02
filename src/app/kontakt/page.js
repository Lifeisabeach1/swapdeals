// app/kontakt/page.js
import ContactPageClient from './ContactPageClient';
import Link from 'next/link'

// Modern SEO Metadata - No keywords meta tag
export const metadata = {
  title: 'Kontakta oss - SwapDeals | Hållbar Byteshandel Sverige',
  description: 'Kontakta SwapDeals för frågor om hållbar byteshandel. Vi svarar inom 24 timmar. E-post: kontakt@swapdeals.se. Skapa en mer cirkulär ekonomi tillsammans.',
  authors: [{ name: 'SwapDeals' }],
  creator: 'SwapDeals',
  publisher: 'SwapDeals',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Kontakta SwapDeals - Hållbar Byteshandel',
    description: 'Kontakta oss för frågor om hållbar byteshandel. Vi svarar inom 24 timmar och hjälper dig skapa en mer cirkulär ekonomi.',
    url: 'https://swapdeals.se/kontakt',
    siteName: 'SwapDeals',
    locale: 'sv_SE',
    type: 'website',
    images: [
      {
        url: '/og-contact.jpg',
        width: 1200,
        height: 630,
        alt: 'Kontakta SwapDeals - Hållbar Byteshandel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kontakta SwapDeals - Hållbar Byteshandel',
    description: 'Kontakta oss för frågor om hållbar byteshandel. Vi svarar inom 24 timmar.',
    images: ['/og-contact.jpg'],
  },
  alternates: {
    canonical: 'https://swapdeals.se/kontakt',
  },
};

// Generate static structured data to avoid runtime issues
function generateStructuredData() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://swapdeals.se/#organization',
        name: 'SwapDeals',
        url: 'https://swapdeals.se',
        logo: {
          '@type': 'ImageObject',
          url: 'https://swapdeals.se/Swapdealsemoji.png',
          width: 512,
          height: 512,
        },
        description: 'Hållbar plattform för byteshandel och cirkulär ekonomi i Sverige',
        foundingDate: '2024',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'kontakt@swapdeals.se',
          contactType: 'customer service',
          areaServed: 'SE',
          availableLanguage: ['sv', 'en'],
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'SE',
          addressLocality: 'Sverige',
        },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://swapdeals.se/kontakt#webpage',
        url: 'https://swapdeals.se/kontakt',
        name: 'Kontakta oss - SwapDeals',
        description: 'Kontakta SwapDeals för frågor om hållbar byteshandel. Vi svarar inom 24 timmar.',
        isPartOf: {
          '@id': 'https://swapdeals.se/#website',
        },
        about: {
          '@id': 'https://swapdeals.se/#organization',
        },
        datePublished: '2024-01-01',
        dateModified: currentDate,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Hem',
              item: 'https://swapdeals.se',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Kontakta oss',
              item: 'https://swapdeals.se/kontakt',
            },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Hur fungerar SwapDeals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SwapDeals gör det enkelt att byta, sälja och köpa begagnade varor. Skapa ett konto, lägg upp dina saker och börja handla med andra användare.',
            },
          },
          {
            '@type': 'Question',
            name: 'Kostar det något att använda SwapDeals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ingenting kostar här, för länge sedan kostade det inte något att byta saker och så inte här heller',
            },
          },
          {
            '@type': 'Question',
            name: 'Hur snabbt får jag svar på min förfrågan?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Vi strävar efter att svara på alla förfrågningar inom 24 timmar på vardagar. För brådskande frågor, kontakta oss direkt via e-post på kontakt@swapdeals.se.',
            },
          },
          {
            '@type': 'Question',
            name: 'Kan jag föreslå nya funktioner till SwapDeals?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolut! Vi värdesätter feedback från våra användare. Skicka dina förslag till oss så tittar vi på möjligheten att implementera dem.',
            },
          },
        ],
      },
    ],
  };
}

export default function ContactPage() {
  const structuredData = generateStructuredData();

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="bg-green-50/50 border-b border-green-200/30">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/" 
                className="text-green-700 hover:text-green-800 transition-colors"
                aria-label="Gå till startsidan"
              >
                Hem
              </Link>
            </li>
            <li aria-hidden="true" className="text-green-400">/</li>
            <li>
              <span className="text-gray-600 font-medium" aria-current="page">
                Kontakta oss
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <ContactPageClient />
    </>
  );
}