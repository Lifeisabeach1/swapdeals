'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Create context
const TradeAppContext = createContext();

// Provider component
export function TradeAppProvider({ children }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use the unified auth system
  const { isAuthenticated, token, user, isLoading: authLoading } = useAuth();

  // Fetch listings from your existing API endpoint
  const fetchListings = async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      if (filters.page) {
        params.append('page', filters.page);
      }
      if (filters.limit) {
        params.append('limit', filters.limit);
      }
      
      const queryString = params.toString();
      const url = `/api/trades${queryString ? `?${queryString}` : ''}`;
      
      console.log('Fetching from URL:', url); // Debug log
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log
      
      if (!response.ok) {
        // Get more detailed error information
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('API Error Details:', errorData);
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('API Response data:', data); // Debug log
      
      if (data.success) {
        setListings(data.data.listings || []);
        return data.data; // Return full data including pagination
      } else {
        throw new Error(data.message || 'Failed to fetch listings');
      }
    } catch (err) {
      console.error('Error fetching listings:', err);
      
      // More specific error handling
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Network error: Unable to connect to the server. Please check your connection.');
      } else if (err.message.includes('404')) {
        setError('API endpoint not found. The /api/trades endpoint may not be implemented yet.');
      } else if (err.message.includes('500')) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.message);
      }
      
      // For development: set empty array so app doesn't break
      if (process.env.NODE_ENV === 'development') {
        console.warn('Setting empty listings array for development');
        setListings([]);
        return { listings: [], total: 0, page: 1, totalPages: 0 };
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load listings on mount with error handling
  useEffect(() => {
    const loadInitialListings = async () => {
      try {
        await fetchListings();
      } catch (err) {
        console.error('Failed to load initial listings:', err);
        // Don't throw here - let the component handle the error state
      }
    };

    loadInitialListings();
  }, []);

  // ENHANCED Function to add a new listing with better error handling
  const addListing = async (newListing) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to create a listing');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      const requestHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: requestHeaders,
        body: JSON.stringify(newListing),
      });

      // Try to parse response even if not ok to get error details
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (parseError) {
        console.error('Failed to parse response JSON:', parseError);
        throw new Error(`HTTP ${response.status}: Failed to parse server response`);
      }

      if (!response.ok) {
        // Enhanced error handling with more specific messages
        if (response.status === 401) {
          throw new Error(`Authentication failed: ${responseData.message || 'Invalid or expired token'}`);
        } else if (response.status === 403) {
          throw new Error(`Access denied: ${responseData.message || 'Insufficient permissions'}`);
        } else if (response.status === 400) {
          throw new Error(`Invalid request: ${responseData.message || 'Please check your input'}`);
        } else if (response.status === 404) {
          throw new Error('API endpoint not found. The /api/trades endpoint may not be implemented yet.');
        } else {
          throw new Error(`Server error (${response.status}): ${responseData.message || 'Unknown error'}`);
        }
      }

      if (responseData.success) {
        // Refresh listings to get the new one with all its data
        await fetchListings();
        console.log('Listing created successfully:', responseData.data);
        return responseData.data;
      } else {
        throw new Error(responseData.message || 'Failed to create listing');
      }
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw to let the calling component handle it
    }
  };

  // Function to get a single listing by slug (now includes seller info)
  const getListingBySlug = async (slug) => {
    try {
      const response = await fetch(`/api/trades/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Listing not found');
        }
        throw new Error(`Failed to fetch listing: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Listing not found');
      }
    } catch (err) {
      console.error('Error fetching listing:', err);
      throw err;
    }
  };

  // Function to get seller profile by user ID
  const getSellerProfile = async (userId) => {
    try {
      const response = await fetch(`/api/users/${userId}/profile`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Seller profile not found');
        }
        throw new Error(`Failed to fetch seller profile: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Seller profile not found');
      }
    } catch (err) {
      console.error('Error fetching seller profile:', err);
      throw err;
    }
  };

  // Function to get seller's other listings
  const getSellerOtherListings = async (userId, excludeListingId = null) => {
    try {
      const params = new URLSearchParams();
      params.append('userId', userId);
      if (excludeListingId) {
        params.append('exclude', excludeListingId);
      }
      
      const response = await fetch(`/api/trades/seller?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch seller listings: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return data.data.listings || [];
      } else {
        throw new Error(data.message || 'Failed to fetch seller listings');
      }
    } catch (err) {
      console.error('Error fetching seller listings:', err);
      throw err;
    }
  };

  // Function to remove a listing
  const removeListing = async (id) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to delete a listing');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      const response = await fetch(`/api/trades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        let errorMessage = `Failed to delete listing: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Use default message if can't parse response
        }
        throw new Error(errorMessage);
      }

      // Update local state
      setListings(prevListings => prevListings.filter(listing => listing.id !== id));
      
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error deleting listing:', err);
      throw err;
    }
  };

  // Function to update a listing
  const updateListing = async (id, updates) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to update a listing');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      const response = await fetch(`/api/trades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        let errorMessage = `Failed to update listing: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Use default message if can't parse response
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh listings to get updated data
        await fetchListings();
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to update listing');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating listing:', err);
      throw err;
    }
  };

  // Function to search listings
  const searchListings = async (searchQuery, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.location && filters.location !== 'all') {
        params.append('location', filters.location);
      }
      
      const response = await fetch(`/api/trades/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search listings: HTTP ${response.status}`);
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
      console.error('Error searching listings:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to contact seller (initiate messaging)
  const contactSeller = async (listingId, message) => {
    try {
      if (!isAuthenticated) {
        throw new Error('You must be logged in to contact sellers');
      }
      
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }
      
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          listingId,
          message
        }),
      });

      if (!response.ok) {
        let errorMessage = `Failed to send message: HTTP ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Use default message if can't parse response
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (err) {
      console.error('Error contacting seller:', err);
      throw err;
    }
  };

  // Helper function to check if user can perform authenticated actions
  const canPerformAuthenticatedAction = () => {
    return isAuthenticated && token && !authLoading;
  };

  // Helper function to clear errors
  const clearError = () => {
    setError(null);
  };

  // Context value
  const contextValue = {
    listings,
    loading,
    error,
    clearError,
    addListing,
    removeListing,
    updateListing,
    getListingBySlug,
    searchListings,
    refreshListings: fetchListings,
    // Seller-related functions
    getSellerProfile,
    getSellerOtherListings,
    contactSeller,
    // Additional utilities
    isAuthenticated,
    currentUser: user,
    canPerformAuthenticatedAction,
    // Debug helpers
    debugAuthState: () => ({
      isAuthenticated,
      hasToken: !!token,
      tokenLength: token?.length,
      hasUser: !!user,
      authLoading
    })
  };

  return (
    <TradeAppContext.Provider value={contextValue}>
      {children}
    </TradeAppContext.Provider>
  );
}

// Custom hook to use the context
export function useTradeApp() {
  const context = useContext(TradeAppContext);
  if (!context) {
    throw new Error('useTradeApp must be used within a TradeAppProvider');
  }
  return context;
}