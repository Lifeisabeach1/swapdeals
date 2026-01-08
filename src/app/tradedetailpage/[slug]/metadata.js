// Generate dynamic metadata for trade listing pages
export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    // Fetch listing data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/trades?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });
    
    if (!response.ok) {
      return {
        title: 'Annons hittades inte | SwapDeals',
        description: 'Denna bytesannons kunde inte hittas.',
      };
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data.listings?.length) {
      return {
        title: 'Annons hittades inte | SwapDeals',
        description: 'Denna bytesannons kunde inte hittas.',
      };
    }
    
    // Find matching listing
    const listing = data.data.listings.find(
      l => l.slug === slug || String(l.id) === String(slug)
    );
    
    if (!listing) {
      return {
        title: 'Annons hittades inte | SwapDeals',
        description: 'Denna bytesannons kunde inte hittas.',
      };
    }
    
    // Get first image or use default
    const imageUrl = listing.images?.[0]?.url || '/planet.webp';
    
    // Ensure absolute URL for images
    const absoluteImageUrl = imageUrl.startsWith('http') 
      ? imageUrl 
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://swapdeals.se'}${imageUrl}`;
    
    // Create description from items
    const offeringItems = listing.itemsOffering
      ?.map(i => i.name || i.description || i)
      .slice(0, 3)
      .join(', ') || 'Föremål';
    
    const wantingItems = listing.itemsWanted
      ?.map(i => i.name || i.description || i)
      .slice(0, 3)
      .join(', ') || 'Önskat';
    
    const description = `Byter: ${offeringItems} mot ${wantingItems}. Plats: ${listing.location || 'Sverige'}. Kategori: ${listing.category || 'Diverse'}`;
    
    // Get full URL for sharing
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swapdeals.se';
    const pageUrl = `${siteUrl}/trade/${slug}`;
    
    return {
      title: `${listing.title} | SwapDeals`,
      description: description,
      
      authors: [{ name: 'SwapDeals', url: 'https://swapdeals.se' }],
      creator: 'SwapDeals',
      publisher: 'SwapDeals',
      
      // Open Graph (Facebook, LinkedIn, etc)
      openGraph: {
        title: listing.title,
        description: description,
        url: pageUrl,
        siteName: 'SwapDeals',
        images: [
          {
            url: absoluteImageUrl,
            width: 1200,
            height: 630,
            alt: listing.title,
            type: 'image/jpeg',
          }
        ],
        locale: 'sv_SE',
        type: 'website',
      },
      
      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        site: '@SwapDealsSE',
        creator: '@SwapDealsSE',
        title: listing.title,
        description: description,
        images: [absoluteImageUrl],
      },
      
      // Additional meta tags
      alternates: {
        canonical: pageUrl,
      },
      
      // Robots
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
      
      // Additional properties
      other: {
        'og:updated_time': listing.updated_at || listing.created_at,
        'article:published_time': listing.created_at,
        'article:author': listing.seller?.name || listing.seller?.username || 'SwapDeals User',
        'product:availability': 'in stock',
        'product:condition': 'used',
        'product:price:amount': '0',
        'product:price:currency': 'SEK',
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Bytesannons | SwapDeals',
      description: 'Hitta bytesannonser och gör hållbara affärer på SwapDeals',
    };
  }
}

// Generate Product JSON-LD Schema
export function generateProductJsonLd(listing) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swapdeals.se';
  const imageUrl = listing.images?.[0]?.url || '/planet.webp';
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${siteUrl}${imageUrl}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteUrl}/trade/${listing.slug}#product`,
    name: listing.title,
    description: listing.description || `Byter: ${listing.itemsOffering?.map(i => i.name || i).join(', ')} mot ${listing.itemsWanted?.map(i => i.name || i).join(', ')}`,
    image: absoluteImageUrl,
    url: `${siteUrl}/trade/${listing.slug}`,
    category: listing.category,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'SEK',
      itemCondition: 'https://schema.org/UsedCondition',
      url: `${siteUrl}/trade/${listing.slug}`,
      seller: {
        '@type': 'Person',
        name: listing.seller?.name || listing.seller?.username || 'SwapDeals User',
      }
    },
   
  };
}

// Generate BreadcrumbList JSON-LD
export function generateBreadcrumbJsonLd(listing) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swapdeals.se';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${siteUrl}/trade/${listing.slug}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Hem',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Bytesannonser',
        item: `${siteUrl}/tradelistingpage`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: listing.category || 'Kategori',
        item: `${siteUrl}/tradelistingpage?category=${listing.category}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: listing.title,
        item: `${siteUrl}/trade/${listing.slug}`,
      }
    ],
  };
}

// Generate WebPage JSON-LD
export function generateWebPageJsonLd(listing) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swapdeals.se';
  const imageUrl = listing.images?.[0]?.url || '/planet.webp';
  const absoluteImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `${siteUrl}${imageUrl}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteUrl}/trade/${listing.slug}#webpage`,
    url: `${siteUrl}/trade/${listing.slug}`,
    name: listing.title,
    description: listing.description || `Bytesannons: ${listing.title}`,
    isPartOf: {
      '@id': `${siteUrl}#website`,
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: absoluteImageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: listing.created_at,
    dateModified: listing.updated_at || listing.created_at,
    inLanguage: 'sv-SE',
  };
}

// Generate ItemList JSON-LD for related listings
export function generateItemListJsonLd(relatedListings) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swapdeals.se';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: relatedListings.map((listing, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${siteUrl}/trade/${listing.slug}`,
      name: listing.title,
    })),
  };
}