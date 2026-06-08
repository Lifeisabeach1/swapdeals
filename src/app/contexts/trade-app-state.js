// app/contexts/trade-app-state.js
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

const TradeAppContext = createContext();

export function TradeAppProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, token, user, isLoading: authLoading } = useAuth();

  // Fetch listings
  const fetchListings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.location && filters.location !== 'all') params.append('location', filters.location);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      
      const queryString = params.toString();
      const url = `/api/trades${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setListings(data.data.listings || []);
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to fetch listings');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError(err.message);
      
      // Development fallback
      if (process.env.NODE_ENV === 'development') {
        setListings([]);
        return { listings: [], total: 0, page: 1, totalPages: 0 };
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load initial listings
  useEffect(() => {
    fetchListings().catch(err => {
      console.error('Failed to load initial listings:', err);
    });
  }, []);

  // Add listing
  const addListing = async (newListing) => {
    if (!isAuthenticated || !token) {
      throw new Error('You must be logged in to create a listing');
    }

    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newListing),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (data.success) {
        await fetchListings();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create listing');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get listing by slug
  const getListingBySlug = async (slug) => {
    try {
      const response = await fetch(`/api/trades/${slug}`);
      
      if (!response.ok) {
        throw new Error(response.status === 404 ? 'Listing not found' : `HTTP ${response.status}`);
      }
      
      const data = await response.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Error fetching listing:', err);
      throw err;
    }
  };

  // Remove listing
  const removeListing = async (id) => {
    if (!isAuthenticated || !token) {
      throw new Error('You must be logged in to delete a listing');
    }
    
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      setListings(prev => prev.filter(listing => listing.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update listing
  const updateListing = async (id, updates) => {
    if (!isAuthenticated || !token) {
      throw new Error('You must be logged in to update a listing');
    }
    
    try {
      const response = await fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      if (data.success) {
        await fetchListings();
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update listing');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Search listings
  const searchListings = async (searchQuery, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.location && filters.location !== 'all') params.append('location', filters.location);
      
      const response = await fetch(`/api/trades/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setListings(data.data.listings || []);
        return data.data;
      } else {
        throw new Error(data.message || 'Search failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Contact seller
  const contactSeller = async (listingId, message) => {
    if (!isAuthenticated || !token) {
      throw new Error('You must be logged in to contact sellers');
    }
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ listingId, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data.success ? data.data : null;
    } catch (err) {
      console.error('Error contacting seller:', err);
      throw err;
    }
  };

  const contextValue = {
    listings,
    loading,
    error,
    clearError: () => setError(null),
    addListing,
    removeListing,
    updateListing,
    getListingBySlug,
    searchListings,
    refreshListings: fetchListings,
    contactSeller,
    isAuthenticated,
    currentUser: user,
    canPerformAuthenticatedAction: () => isAuthenticated && token && !authLoading,
  };

  return (
    <TradeAppContext.Provider value={contextValue}>
      {children}
    </TradeAppContext.Provider>
  );
}

export function useTradeApp() {
  const context = useContext(TradeAppContext);
  if (!context) {
    throw new Error('useTradeApp must be used within a TradeAppProvider');
  }
  return context;
}
