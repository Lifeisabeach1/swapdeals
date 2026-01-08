'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTradeApp } from '@/app/contexts/trade-app-state';
import TradeDetailContent from '@/components/TradeDetailContent';
import { useAuth } from '@/hooks/useAuth';
import useApi from '@/hooks/useApi';

export default function TradeDetailClient({ slug }) {
  const router = useRouter();
  const { listings = [] } = useTradeApp() || {};
  const { user, isAuthenticated, token } = useAuth();
  const api = useApi(token);
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [tradeOffers, setTradeOffers] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(true);
  const [activeTrade, setActiveTrade] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  // Fetch listing directly from API instead of context  
  useEffect(() => {
    const fetchListing = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        console.log('🔍 Fetching listings from API...');
        
        // Fetch all listings with cache-busting
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/trades?_t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        
        const data = await response.json();
        console.log('📦 API Response:', data);
        
        if (data.success && data.data.listings?.length > 0) {
          const allListings = data.data.listings;
          console.log(`📋 Total listings: ${allListings.length}`);
          
          // Find matching listing
          let foundListing = null;
          
          // Try exact slug match
          foundListing = allListings.find(l => l.slug === slug);
          if (foundListing) {
            console.log('✅ Found by EXACT SLUG match');
          }
          
          // Try ID match
          if (!foundListing) {
            foundListing = allListings.find(l => String(l.id) === String(slug));
            if (foundListing) console.log('✅ Found by ID match');
          }
          
          if (foundListing) {
            console.log('📍 Listing details:', {
              id: foundListing.id,
              title: foundListing.title,
              slug: foundListing.slug,
              imageCount: foundListing.images?.length || 0,
              images: foundListing.images
            });
            setListing(foundListing);
          } else {
            console.log('❌ No matching listing found for slug:', slug);
            setListing(null);
          }
        } else {
          console.log('❌ No listings in API response');
          setListing(null);
        }
      } catch (error) {
        console.error('❌ Error fetching listing:', error);
        setListing(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [slug]);

  // Mount state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Computed values
  const computedValues = useMemo(() => {
    const isOwner = listing?.seller?.id === user?.id || listing?.user_id === user?.id;
    const canMakeOffers = isAuthenticated && !isOwner && (!activeTrade || !['accepted', 'completed', 'closed'].includes(activeTrade?.status));
    const canAcceptOffers = isAuthenticated && isOwner && (!activeTrade || activeTrade.status !== 'accepted');
    const isPartOfActiveTrade = activeTrade && user && (isOwner || activeTrade.user?.id === user.id || activeTrade.user_id === user.id);
    const otherUser = activeTrade && user ? (isOwner ? activeTrade.user || { id: activeTrade.user_id, name: 'Trader', username: 'trader' } : listing.seller || { id: listing.user_id, name: 'Owner', username: 'owner' }) : null;

    return { isOwner, isAuthenticated, canMakeOffers, canAcceptOffers, isPartOfActiveTrade, otherUser };
  }, [listing, user, activeTrade, isAuthenticated]);

  // Get unique images
  const uniqueImages = useMemo(() => {
    if (!listing?.images?.length) {
      console.log('No images for listing:', listing?.title);
      return [];
    }
    
    console.log('Processing images for listing:', listing?.title);
    console.log('All images:', listing.images);
    
    const seen = new Set();
    const unique = listing.images.filter(img => {
      // Use id as primary unique identifier
      if (img.id && seen.has(img.id)) return false;
      if (img.id) {
        seen.add(img.id);
        return true;
      }
      
      // Fallback to URL if no id
      if (img.url && seen.has(img.url)) return false;
      if (img.url) {
        seen.add(img.url);
        return true;
      }
      
      return false;
    });
    
    console.log('Unique images:', unique);
    return unique;
  }, [listing?.images, listing?.title]);

  // Process items
  const processedItems = useMemo(() => {
    if (!listing) return { offering: [], wanting: [] };
    
    // Use itemsOffering and itemsWanted from API if available
    let offering = listing.itemsOffering || [];
    let wanting = listing.itemsWanted || [];
    
    // Fallback to filtering items array by type
    if (offering.length === 0 && listing.items?.length > 0) {
      offering = listing.items.filter(item => item.type === 'offering');
    }
    
    if (wanting.length === 0 && listing.items?.length > 0) {
      wanting = listing.items.filter(item => item.type === 'wanting');
    }
    
    return { offering, wanting };
  }, [listing]);

  // Load trade offers - FIXED to prevent infinity loop
  useEffect(() => {
    let isMounted = true;
    
    const fetchOffers = async () => {
      if (!listing?.id) return;
      
      try {
        setLoadingOffers(true);
        
        // Use fetch directly to avoid api dependency
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`/api/trades/${listing.id}/offers`, {
          headers,
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }
        
        const data = await response.json();
        
        if (data.success && isMounted) {
          const offers = data.data || [];
          
          // Remove duplicates based on offer ID
          const uniqueOffers = [];
          const seenIds = new Set();
          
          offers.forEach(offer => {
            if (!seenIds.has(offer.id)) {
              seenIds.add(offer.id);
              uniqueOffers.push(offer);
            }
          });
          
          setTradeOffers(uniqueOffers);
          
          const acceptedOffer = uniqueOffers.find(offer => offer.status === 'accepted');
          setActiveTrade(acceptedOffer || null);
        }
      } catch (error) {
        console.error('Failed to load trade offers:', error);
      } finally {
        if (isMounted) {
          setLoadingOffers(false);
        }
      }
    };
    
    if (listing?.id) {
      fetchOffers();
    }
    
    return () => {
      isMounted = false;
    };
  }, [listing?.id, token]);

  const loadTradeOffers = async () => {
    if (!listing?.id) return;
    
    try {
      setLoadingOffers(true);
      const response = await api.get(`/api/trades/${listing.id}/offers`);
      
      if (response.success) {
        const offers = response.data || [];
        
        // Remove duplicates based on offer ID
        const uniqueOffers = [];
        const seenIds = new Set();
        
        offers.forEach(offer => {
          if (!seenIds.has(offer.id)) {
            seenIds.add(offer.id);
            uniqueOffers.push(offer);
          }
        });
        
        setTradeOffers(uniqueOffers);
        
        const acceptedOffer = uniqueOffers.find(offer => offer.status === 'accepted');
        setActiveTrade(acceptedOffer || null);
      }
    } catch (error) {
      console.error('Failed to load trade offers:', error);
    } finally {
      setLoadingOffers(false);
    }
  };

  // Alert handlers
  const showAlert = (message, type = 'info') => {
    setAlert({ show: true, message, type });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  // Business logic handlers
  const handleSubmitOffer = async (newOffer) => {
    if (activeTrade && ['accepted', 'completed', 'closed'].includes(activeTrade.status)) {
      return showAlert('Detta byte är inte längre tillgängligt', 'warning');
    }
    if (!isAuthenticated) {
      return showAlert('Logga in för att göra ett erbjudande', 'warning');
    }
    if (computedValues.isOwner) {
      return showAlert('Du kan inte lämna ett erbjudande på din egen annons', 'error');
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
        
        // Add to list only if not already present
        setTradeOffers(prev => {
          const exists = prev.some(o => o.id === createdOffer.id);
          return exists ? prev : [createdOffer, ...prev];
        });
        
        showAlert('Erbjudande skickat!', 'success');
      } else {
        throw new Error(response.message || 'Misslyckades');
      }
    } catch (error) {
      showAlert(`Misslyckades: ${error.message}`, 'error');
    }
  };

  const handleAcceptOffer = async (offer) => {
    if (!isAuthenticated) {
      return showAlert('Logga in för att acceptera erbjudanden', 'warning');
    }
    if (!computedValues.isOwner) {
      return showAlert('Endast ägaren kan acceptera erbjudanden', 'error');
    }

    try {
      const response = await api.post(`/api/trades/${listing.slug}/offers/${offer.id}/accept`);
      if (!response.success) {
        throw new Error(response.message || 'Misslyckades');
      }

      const tradeData = response.data;
      const acceptedOffer = { ...offer, status: 'accepted', accepted_at: new Date().toISOString() };
      setTradeOffers(prev => prev.map(o => o.id === offer.id ? acceptedOffer : o));
      setActiveTrade(acceptedOffer);
      showAlert('Erbjudande accepterat!', 'success');
      
      setTimeout(() => {
        router.push(`/traderoom/${tradeData.id}`);
      }, 1500);
    } catch (error) {
      showAlert(`Misslyckades: ${error.message}`, 'error');
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
          setTimeout(() => router.push('/my-trades'), 2000);
        } else if (action === 'cancel') {
          setActiveTrade(null);
          setTradeOffers(prev => prev.map(o => o.id === activeTrade.id ? { ...o, status: 'cancelled' } : o));
        }
        showAlert(successMessage, 'success');
      } else {
        throw new Error(response.message || `Failed to ${action}`);
      }
    } catch (error) {
      showAlert(`Misslyckades: ${error.message}`, 'error');
    }
  };

  const handleDeleteListing = async (listing) => {
    try {
      const response = await api.delete(`/api/trades/${listing.slug}`);
      if (response.success) {
        showAlert('Annons borttagen!', 'success');
        setTimeout(() => router.push('/'), 1500);
      } else {
        throw new Error(response.message || 'Misslyckades');
      }
    } catch (error) {
      showAlert(`Misslyckades: ${error.message}`, 'error');
    }
  };

  const handleCompleteTrade = () => handleTradeAction(
    'complete',
    'complete',
    'Bytet slutfört!',
    'Är du säker på att du vill slutföra detta byte?'
  );

  const handleCancelTrade = () => handleTradeAction(
    'cancel',
    'cancel',
    'Bytet avbrutet',
    'Är du säker på att du vill avbryta detta byte?'
  );

  // Loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar bytesinformation...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Package className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Annons hittades inte</h1>
        <p className="text-gray-600 mb-4">Annonsen du söker finns inte eller har tagits bort.</p>
       
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Content */}
      <TradeDetailContent 
        listing={listing}
        mounted={mounted}
        tradeOffers={tradeOffers}
        loadingOffers={loadingOffers}
        activeTrade={activeTrade}
        showConversation={showConversation}
        computedValues={computedValues}
        uniqueImages={uniqueImages}
        processedItems={processedItems}
        alert={alert}
        user={user}
        token={token}
        isAuthenticated={isAuthenticated}
        onSubmitOffer={handleSubmitOffer}
        onAcceptOffer={handleAcceptOffer}
        onCompleteTrade={handleCompleteTrade}
        onCancelTrade={handleCancelTrade}
        onDeleteListing={handleDeleteListing}
        onShowConversation={() => setShowConversation(true)}
        onCloseConversation={() => setShowConversation(false)}
        onShowAlert={showAlert}
        onCloseAlert={closeAlert}
        onNavigation={(path) => router.push(path)}
      />
    </div>
  );
}