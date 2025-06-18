// src/lib/utils/viewTracking.js

/**
 * Record a view for a specific listing
 * @param {string|number} listingId - The ID of the listing being viewed
 * @returns {Promise<boolean>} - Success status
 */
export async function recordListingView(listingId) {
  try {
    if (!listingId) {
      console.warn('recordListingView: No listing ID provided');
      return false;
    }

    const response = await fetch(`/api/listings/${listingId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (data.success) {
      console.log(`View recorded for listing ${listingId}: ${data.data.views} total views`);
      return true;
    } else {
      console.warn('Failed to record view:', data.message);
      return false;
    }
  } catch (error) {
    console.error('Error recording listing view:', error);
    return false;
  }
}

/**
 * Get view statistics for a listing
 * @param {string|number} listingId - The ID of the listing
 * @returns {Promise<Object|null>} - View statistics or null if failed
 */
export async function getListingViewStats(listingId) {
  try {
    if (!listingId) {
      console.warn('getListingViewStats: No listing ID provided');
      return null;
    }

    const response = await fetch(`/api/listings/${listingId}/view`);
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.warn('Failed to get view stats:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Error getting listing view stats:', error);
    return null;
  }
}

/**
 * Debounced view tracking to prevent spam
 * @param {string|number} listingId - The ID of the listing
 * @param {number} delay - Delay in milliseconds (default: 2000ms)
 */
let viewTimeouts = new Map();

export function recordListingViewDebounced(listingId, delay = 2000) {
  if (!listingId) return;

  // Clear existing timeout for this listing
  if (viewTimeouts.has(listingId)) {
    clearTimeout(viewTimeouts.get(listingId));
  }

  // Set new timeout
  const timeoutId = setTimeout(() => {
    recordListingView(listingId);
    viewTimeouts.delete(listingId);
  }, delay);

  viewTimeouts.set(listingId, timeoutId);
}

/**
 * Hook for React components to track views
 * @param {string|number} listingId - The ID of the listing
 * @param {boolean} enabled - Whether tracking is enabled (default: true)
 * @returns {Function} - Function to manually trigger view recording
 */
export function useViewTracking(listingId, enabled = true) {
  const recordView = () => {
    if (enabled && listingId) {
      recordListingViewDebounced(listingId);
    }
  };

  return recordView;
}

/**
 * Batch record views for multiple listings (useful for list views)
 * @param {Array<string|number>} listingIds - Array of listing IDs
 * @returns {Promise<Object>} - Results summary
 */
export async function recordBatchViews(listingIds) {
  if (!Array.isArray(listingIds) || listingIds.length === 0) {
    return { success: 0, failed: 0, total: 0 };
  }

  const results = await Promise.allSettled(
    listingIds.map(id => recordListingView(id))
  );

  const summary = {
    success: results.filter(r => r.status === 'fulfilled' && r.value === true).length,
    failed: results.filter(r => r.status === 'rejected' || r.value === false).length,
    total: results.length
  };

  console.log('Batch view recording results:', summary);
  return summary;
}