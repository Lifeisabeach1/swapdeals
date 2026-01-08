import { Suspense } from 'react';
import TradeDetailClient from './TradeClient';
import { 
  generateMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  generateWebPageJsonLd,
} from './metadata';

// Export metadata generation
export { generateMetadata };

// Loading component
function TradeDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-24 w-24 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Laddar bytesinformation...</p>
      </div>
    </div>
  );
}

// Fetch listing data for JSON-LD
async function getListingData(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/trades?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    if (!data.success || !data.data.listings?.length) return null;
    
    const listing = data.data.listings.find(
      l => l.slug === slug || String(l.id) === String(slug)
    );
    
    return listing;
  } catch (error) {
    console.error('Error fetching listing for JSON-LD:', error);
    return null;
  }
}

// Server Component - Page
export default async function TradeDetailPage({ params }) {
  // Await params before accessing its properties
  const resolvedParams = await params;
  const listing = await getListingData(resolvedParams.slug);
  
  return (
    <>
      {/* JSON-LD Schema Markup - Only if listing exists */}
      {listing && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(generateProductJsonLd(listing)) 
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(generateBreadcrumbJsonLd(listing)) 
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
              __html: JSON.stringify(generateWebPageJsonLd(listing)) 
            }}
          />
        </>
      )}
      
      {/* Main Content */}
      <Suspense fallback={<TradeDetailLoading />}>
        <TradeDetailClient slug={resolvedParams.slug} />
      </Suspense>
    </>
  );
}

// Optional: Generate static params for static generation
// Uncomment if you want to pre-render popular listings
/*
export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/trades`);
    const data = await response.json();
    
    if (!data.success || !data.data.listings) {
      return [];
    }
    
    // Generate params for the first 100 listings (adjust as needed)
    return data.data.listings.slice(0, 100).map((listing) => ({
      slug: listing.slug || String(listing.id),
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
*/