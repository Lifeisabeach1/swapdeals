//src/app/tradedetailpage/[slug]/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Package } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useParams, useRouter } from 'next/navigation';
import { useTradeApp } from '@/app/contexts/trade-app-state';
import TradeDetailContent from '@/components/TradeDetailContent';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';

// Meta tags component for better SEO
function TradeDetailMeta({ listing }) {
  if (!listing) return null;

  const title = listing.title || listing.itemsToTrade?.[0]?.name || 'Bytesannons';
  const description = listing.description || `Byt ${title} på SwapDeals - Sveriges hållbara bytesmarknad. Miljövänligt alternativ till att köpa nytt.`;
  const imageUrl = listing.images?.[0]?.url || '/Swapdealsemoji.png';
  const url = `https://swapdeals.se/tradedetailpage/${listing.slug}`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{`${title} - Byt på SwapDeals | Hållbar Bytesmarknad Sverige`}</title>
      <meta name="title" content={`${title} - Byt på SwapDeals | Hållbar Bytesmarknad Sverige`} />
      <meta name="description" content={description} />
      <meta name="keywords" content={`byta, byte, ${title}, hållbart, miljövänligt, begagnat, second hand, sverige, gratis, marknad, SwapDeals`} />
      <meta name="robots" content="index, follow" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Swedish" />
      <meta name="author" content="SwapDeals" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={`${title} - Byt på SwapDeals`} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="SwapDeals" />
      <meta property="og:locale" content="sv_SE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={`${title} - Byt på SwapDeals`} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />
      <meta property="twitter:creator" content="@SwapDeals" />

      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#10b981" />
      <meta name="msapplication-TileColor" content="#10b981" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="SwapDeals" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": title,
            "description": description,
            "image": imageUrl,
            "url": url,
            "brand": {
              "@type": "Brand",
              "name": "SwapDeals"
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "SEK",
              "price": "0",
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              "seller": {
                "@type": "Organization",
                "name": "SwapDeals"
              }
            },
            "category": "Byteshandel",
            "condition": "https://schema.org/UsedCondition"
          })
        }}
      />
    </Head>
  );
}

export default function TradeDetailSlugPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  const { listings = [] } = useTradeApp() || {};
  const { user, isAuthenticated, token } = useAuth();
  const api = useApi(token);
  
  // Component state
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({ slug: '', availableListings: 0, listingTitles: [] });
  
  // Business logic state - moved from TradeDetailContent
  const [tradeOffers, setTradeOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [activeTrade, setActiveTrade] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  
  // Alert state - moved from TradeDetailContent
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'info',
    title: null
  });
  
  useEffect(() => {
    setMounted(true);
    console.log("Available listings:", listings);
    console.log("Current slug:", slug);
    
    // Set debug info
    setDebugInfo({
      slug: slug || 'undefined',
      availableListings: listings?.length || 0,
      listingTitles: listings?.map(l => ({
        id: l.id,
        title: l.title,
        slug: l.slug,
        generatedSlug: generateSlugFromTitle(l.title || l.itemsToTrade?.[0]?.name || 'untitled')
      })) || []
    });

    // Simulate loading time and then set loading to false
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [listings, slug]);
  
  // Improved slug generation function that matches your backend logic
  const generateSlugFromTitle = (title) => {
    if (!title) return 'untitled-item';
    
    return title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-')        // Replace spaces with hyphens
      .replace(/-+/g, '-')         // Replace multiple hyphens with single
      .replace(/^-|-$/g, '')       // Remove leading/trailing hyphens
      .trim() || 'untitled-item';
  };

  // Parse slug to extract timestamp and base slug
  const parseSlug = (slug) => {
    if (!slug) return { originalSlug: null, timestamp: null, baseSlug: null };
    
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];
    const isTimestamp = /^\d{13}$/.test(lastPart); // 13 digits for timestamp
    
    return {
      originalSlug: slug,
      timestamp: isTimestamp ? parseInt(lastPart) : null,
      baseSlug: isTimestamp ? parts.slice(0, -1).join('-') : slug
    };
  };
  
  // Enhanced listing finder with better slug matching
  const findListing = () => {
    if (!slug || !listings?.length) return null;
    
    console.log(`🔍 Searching for listing with slug: "${slug}"`);
    console.log(`📋 Available listings:`, listings.map(l => ({ id: l.id, slug: l.slug, title: l.title })));
    
    // Method 1: Try exact slug match first (most reliable)
    let found = listings.find(l => l.slug === slug);
    if (found) {
      console.log(`✅ Found by exact slug match:`, found.slug);
      return found;
    }
    
    // Method 2: Try direct ID match (convert both to strings for comparison)
    found = listings.find(l => String(l.id) === String(slug));
    if (found) {
      console.log(`✅ Found by direct ID match:`, found.id);
      return found;
    }
    
    // Method 3: Parse the slug and match by base slug + timestamp logic
    const parsedSlug = parseSlug(slug);
    console.log(`Parsed slug:`, parsedSlug);
    
    if (parsedSlug.baseSlug) {
      // Try to find a listing whose slug has the same base part
      found = listings.find(l => {
        if (!l.slug) return false;
        
        const listingParsed = parseSlug(l.slug);
        const baseMatches = listingParsed.baseSlug === parsedSlug.baseSlug;
        
        if (baseMatches) {
          console.log(`✅ Found by base slug match: "${l.slug}" (base: "${listingParsed.baseSlug}")`);
        }
        
        return baseMatches;
      });
      if (found) return found;
      
      // Also try matching the base slug against generated slugs from titles
      found = listings.find(l => {
        const title = l.title || l.itemsToTrade?.[0]?.name || 'untitled';
        const generatedBaseSlug = generateSlugFromTitle(title);
        const matches = generatedBaseSlug === parsedSlug.baseSlug;
        
        if (matches) {
          console.log(`✅ Found by title->base slug match: "${title}" -> "${generatedBaseSlug}"`);
        }
        
        return matches;
      });
      if (found) return found;
    }
    
    // Method 4: Try matching by generated slug from title (for backwards compatibility)
    found = listings.find(l => {
      const title = l.title || l.itemsToTrade?.[0]?.name || 'untitled';
      const generatedSlug = generateSlugFromTitle(title);
      const matches = generatedSlug === slug;
      
      if (matches) {
        console.log(`✅ Found by title slug match: "${title}" -> "${generatedSlug}"`);
      }
      
      return matches;
    });
    if (found) return found;
    
    // Method 5: Try numeric index matching (fallback)
    const index = parseInt(slug);
    if (!isNaN(index) && index >= 0 && index < listings.length) {
      console.log(`✅ Found by index match: ${index}`);
      return listings[index];
    }
    
    // Method 6: Try partial ID matching (very permissive fallback)
    found = listings.find(l => {
      const idStr = String(l.id);
      const slugStr = String(slug);
      return idStr.includes(slugStr) || slugStr.includes(idStr);
    });
    if (found) {
      console.log(`✅ Found by partial ID match:`, found.id);
      return found;
    }
    
    console.log(`❌ No listing found for slug: "${slug}"`);
    return null;
  };

  const listing = findListing();

  // Memoized computed values - moved from TradeDetailContent
  const computedValues = useMemo(() => {
    const isOwner = listing?.seller?.id === user?.id || listing?.user_id === user?.id;
    const isAuthenticatedUser = Boolean(user && token);
    
    const canMakeOffers = isAuthenticatedUser && 
      !isOwner && 
      (!activeTrade || !['accepted', 'completed', 'closed'].includes(activeTrade?.status));
    
    const canAcceptOffers = isAuthenticatedUser && isOwner && 
      (!activeTrade || activeTrade.status !== 'accepted');
    
    const isPartOfActiveTrade = activeTrade && user && (
      isOwner || 
      activeTrade.user?.id === user.id || 
      activeTrade.user_id === user.id
    );

    const otherUser = activeTrade && user ? (
      isOwner 
        ? activeTrade.user || { id: activeTrade.user_id, name: 'Trader', username: 'trader' }
        : listing.seller || { id: listing.user_id, name: 'Owner', username: 'owner' }
    ) : null;

    return {
      isOwner,
      isAuthenticated: isAuthenticatedUser,
      canMakeOffers,
      canAcceptOffers,
      isPartOfActiveTrade,
      otherUser
    };
  }, [listing, user, token, activeTrade]);

  // Get unique images helper - moved from TradeDetailContent
  const getUniqueImages = (images) => {
    if (!images || images.length === 0) return [];
    const seen = new Set();
    return images.filter(image => {
      if (seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    });
  };

  const uniqueImages = useMemo(() => getUniqueImages(listing?.images), [listing?.images]);

  // Consolidated item processing - moved from TradeDetailContent
  const processedItems = useMemo(() => {
    if (!listing) return { offering: [], wanting: [] };

    const offering = [
      ...(listing.itemsOffering || []),
      ...(listing.items?.filter(item => item.type === 'offering') || [])
    ];

    const wanting = [
      ...(listing.itemsWanting || []),
      ...(listing.items?.filter(item => item.type === 'wanting') || []),
      ...(listing.itemsWanted || [])
    ];

    return { offering, wanting };
  }, [listing]);

  // Load trade offers when listing changes - moved from TradeDetailContent
  useEffect(() => {
    if (listing?.id) {
      loadTradeOffers();
    }
  }, [listing?.id]);

  const loadTradeOffers = async () => {
    try {
      setLoadingOffers(true);
      const response = await api.get(`/api/trades/${listing.id}/offers`);
      
      if (response.success) {
        const offers = response.data || [];
        setTradeOffers(offers);
        const acceptedOffer = offers.find(offer => offer.status === 'accepted');
        setActiveTrade(acceptedOffer || null);
      }
    } catch (error) {
      console.error('Failed to load trade offers:', error);
    } finally {
      setLoadingOffers(false);
    }
  };

  // Navigation helper
  const handleNavigation = (path) => {
    router.push(path);
  };

  // Alert management - moved from TradeDetailContent
  const showAlert = (message, type = 'info', title = null) => {
    setAlert({
      show: true,
      message,
      type,
      title
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Business logic - moved from TradeDetailContent
  const handleSubmitOffer = async (newOffer) => {
    if (activeTrade && ['accepted', 'completed', 'closed'].includes(activeTrade.status)) {
      return showAlert('Detta byte är inte längre tillgängligt för nya erbjudanden.', 'warning', 'Byte otillgängligt');
    }

    if (!computedValues.isAuthenticated) {
      return showAlert('Var god logga in för att göra ett byteserbjudande.', 'warning', 'Inloggning krävs');
    }

    if (computedValues.isOwner) {
      return showAlert('Du kan inte lämna ett erbjudande på din egen annons.', 'error', 'Ogiltig åtgärd');
    }

    try {
      const offerData = {
        message: newOffer.message,
        images: newOffer.images || null,
        listing_id: parseInt(listing.id),
        user_id: parseInt(user.id),
      };

      const response = await api.post(`/api/trades/${listing.id}/offers`, offerData);
      
      if (response.success) {
        const createdOffer = {
          id: response.data.id,
          message: newOffer.message,
          images: newOffer.images,
          timestamp: response.data.created_at || new Date().toISOString(),
          status: response.data.status || 'pending',
          user: {
            id: user.id,
            name: user.username || user.name || user.email,
            avatar: user.avatar_url
          }
        };
        
        setTradeOffers(prev => [createdOffer, ...prev]);
        showAlert('Ditt byteserbjudande har publicerats framgångsrikt!', 'success', 'Erbjudandet skickades');
      } else {
        throw new Error(response.message || 'Misslyckades med att skicka erbjudandet');
      }
    } catch (error) {
      showAlert(`Misslyckades med att publicera bytes erbjudande: ${error.message}`, 'error', 'Erbjudandet skickades inte');
    }
  };

  const handleAcceptOffer = async (offer) => {
    if (!computedValues.isAuthenticated) {
      return showAlert('Logga in för att acceptera bytes erbjudanden.', 'warning', 'Inloggning krävs');
    }

    if (!computedValues.isOwner) {
      return showAlert('Endast annonsens ägare kan acceptera byteserbjudanden.', 'error', 'Tillträde nekat');
    }

    try {
      const response = await api.post(`/api/trades/${listing.slug}/offers/${offer.id}/accept`);
      
      if (!response.success) {
        throw new Error(response.message || 'Misslyckades med att acceptera erbjudandet');
      }

      const tradeData = response.data;
      const acceptedOffer = { 
        ...offer, 
        status: 'accepted', 
        accepted_at: new Date().toISOString() 
      };

      setTradeOffers(prev => prev.map(o => o.id === offer.id ? acceptedOffer : o));
      setActiveTrade(acceptedOffer);
      
      showAlert('Byteserbjudande accepterat! Omdirigerar till...', 'success', 'Bytet accepterat');
      
      setTimeout(() => {
        handleNavigation(`/traderoom/${tradeData.id}`);
      }, 1500);

    } catch (error) {
      console.error('Error accepting offer:', error);
      showAlert(`Failed to accept trade offer: ${error.message}`, 'error', 'Accept Failed');
    }
  };
  
  const handleTradeAction = async (action, endpoint, successMessage, confirmMessage = null) => {
    if (!activeTrade) return;
    
    if (confirmMessage && !confirm(confirmMessage)) return;

    try {
      const response = await api.post(`/api/trades/${activeTrade.id}/${endpoint}`);
      
      if (response.success) {
        if (action === 'complete') {
          setActiveTrade(prev => ({ ...prev, status: 'completed' }));
          setTimeout(() => handleNavigation('/my-trades'), 2000);
        } else if (action === 'cancel') {
          setActiveTrade(null);
          setTradeOffers(prev => 
            prev.map(o => o.id === activeTrade.id ? { ...o, status: 'cancelled' } : o)
          );
        }
        showAlert(successMessage, 'success', action === 'complete' ? 'Trade Completed' : 'Trade Cancelled');
      } else {
        throw new Error(response.message || `Failed to ${action} trade`);
      }
    } catch (error) {
      showAlert(`Failed to ${action} trade: ${error.message}`, 'error', 'Action Failed');
    }
  };

  const handleDeleteListing = async (listing) => {
    try {
      const response = await api.delete(`/api/trades/${listing.slug}`);
      
      if (response.success) {
        showAlert('Listing deleted successfully!', 'success', 'Listing Deleted');
        setTimeout(() => {
          handleNavigation('/');
        }, 1500);
      } else {
        throw new Error(response.message || 'Failed to delete listing');
      }
    } catch (error) {
      console.error('Delete error:', error);
      showAlert(`Failed to delete listing: ${error.message}`, 'error', 'Delete Failed');
    }
  };

  const handleCompleteTrade = () => handleTradeAction(
    'complete',
    'complete',
    'Bytet har markerats som slutfört! Tack för att du använder vår plattform.',
    'Är du säker på att du vill markera detta byte som slutfört? Denna åtgärd kan inte ångras.'
  );

  const handleCancelTrade = () => handleTradeAction(
    'cancel',
    'cancel',
    'Bytet avbröts. Annonsen är nu tillgänglig för andra användare igen.',
    'Är du säker på att du vill avbryta detta aktiva byte?.'
  );

  // Show conversation handler
  const handleShowConversation = () => {
    setShowConversation(true);
  };

  const handleCloseConversation = () => {
    setShowConversation(false);
  };

  // Loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/Swapdealsemoji.png"
                alt="SwapDeals Logo"
                width={40}
                height={40}
                className="object-contain opacity-70"
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Laddar bytesinformation...</p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <>
        <TradeDetailMeta listing={null} />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <Package className="w-16 h-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Listing Not Found</h1>
          <p className="text-gray-600 mb-2">The trade listing you are looking for doesnt exist or has been removed.</p>
          
          {/* Enhanced Debug Information */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-sm max-w-4xl overflow-auto">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <p><strong>Requested Slug:</strong> {debugInfo.slug}</p>
            <p><strong>Parsed Slug:</strong> {JSON.stringify(parseSlug(debugInfo.slug), null, 2)}</p>
            <p><strong>Available Listings:</strong> {debugInfo.availableListings}</p>
            
            {debugInfo.listingTitles.length > 0 && (
              <div className="mt-2">
                <strong>Available Listings Details:</strong>
                <ul className="mt-1 space-y-1">
                  {debugInfo.listingTitles.map((item, index) => (
                    <li key={index} className="text-xs bg-white p-2 rounded">
                      <strong>ID:</strong> {item.id} <br />
                      <strong>Title:</strong> {item.title} <br />
                      <strong>Actual Slug:</strong> {item.slug || 'null'} <br />
                      <strong>Generated Slug:</strong> {item.generatedSlug} <br />
                      <strong>Parsed Actual:</strong> {item.slug ? JSON.stringify(parseSlug(item.slug)) : 'N/A'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <Link
            href="/tradelistingpage"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Tillbaka till annonser
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <TradeDetailMeta listing={listing} />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div>
                <Link href="/tradelistingpage">
                  <button className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center">
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Tillbaka till annonser
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Pass all the computed data and handlers to the content component */}
        <TradeDetailContent 
          // Core data
          listing={listing}
          mounted={mounted}
          
          // Trade data
          tradeOffers={tradeOffers}
          loadingOffers={loadingOffers}
          activeTrade={activeTrade}
          showConversation={showConversation}
          
          // Computed values
          computedValues={computedValues}
          uniqueImages={uniqueImages}
          processedItems={processedItems}
          
          // Alert state
          alert={alert}
          
          // User data
          user={user}
          isAuthenticated={isAuthenticated}
          
          // Handlers
          onSubmitOffer={handleSubmitOffer}
          onAcceptOffer={handleAcceptOffer}
          onCompleteTrade={handleCompleteTrade}
          onCancelTrade={handleCancelTrade}
          onDeleteListing={handleDeleteListing}
          onShowConversation={handleShowConversation}
          onCloseConversation={handleCloseConversation}
          onShowAlert={showAlert}
          onCloseAlert={closeAlert}
          onNavigation={handleNavigation}
        />
      </div>
    </>
  );
}