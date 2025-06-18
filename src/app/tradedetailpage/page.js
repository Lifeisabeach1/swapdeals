// src/app/tradedetailpage/[slug]/page.js
import TradeDetailContent from '@/components/TradeDetailContent';

export default function TradeDetailSlugPage({ params }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TradeDetailContent slug={params.slug} />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  // Ensure params.slug exists
  if (!params?.slug) {
    return {
      title: 'Trade Listing',
      description: 'View this trade listing and connect with the seller.'
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/trades/${params.slug}`, {
      cache: 'no-store' // Ensure fresh data for metadata
    });
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.success && data.data) {
        return {
          title: `${data.data.title} - Trade Listing`,
          description: data.data.description?.substring(0, 160) || `Trade listing: ${data.data.title}`,
          openGraph: {
            title: data.data.title,
            description: data.data.description || data.data.title,
            images: data.data.images?.length > 0 ? [data.data.images[0].url] : [],
            type: 'website',
          },
        };
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }
  
  // Fallback metadata
  return {
    title: 'Trade Listing',
    description: 'View this trade listing and connect with the seller.'
  };
}

// Generate static params if you want to pre-build some pages
export async function generateStaticParams() {
  // You can return an empty array to not pre-build any pages
  // or fetch some popular trade IDs to pre-build
  return [];
}