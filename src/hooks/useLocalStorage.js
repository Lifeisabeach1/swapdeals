// hooks/useLocalStorage.js
'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook for managing localStorage with React state
 * 
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Server-side rendering safe
 * - Syncs across browser tabs
 * - Error handling for corrupted data
 * - TypeScript-friendly
 * 
 * @param {string} key - The localStorage key
 * @param {any} initialValue - Default value if key doesn't exist
 * @returns {[any, Function, Function]} [value, setValue, removeValue]
 * 
 * @example
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 * 
 * // Set value
 * setUser({ name: 'John', email: 'john@example.com' });
 * 
 * // Update with function
 * setUser(prev => ({ ...prev, name: 'Jane' }));
 * 
 * // Remove value
 * removeUser();
 */
const useLocalStorage = (key, initialValue) => {
  // Initialize state with value from localStorage or initialValue
  const [storedValue, setStoredValue] = useState(() => {
    // Server-side rendering check
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get item from localStorage
      const item = window.localStorage.getItem(key);
      
      // Handle edge cases: null, undefined, "undefined", "null"
      if (item === null || 
          item === undefined || 
          item === 'undefined' || 
          item === 'null') {
        return initialValue;
      }
      
      // Parse and return stored JSON
      return JSON.parse(item);
      
    } catch (error) {
      // If parsing fails (corrupted data), clean up and return initial value
      console.error(`Error reading localStorage key "${key}":`, error);
      
      try {
        window.localStorage.removeItem(key);
      } catch (removeError) {
        console.error(`Error removing corrupted localStorage key "${key}":`, removeError);
      }
      
      return initialValue;
    }
  });

  /**
   * Set value in both state and localStorage
   * Supports functional updates like useState
   */
  const setValue = (value) => {
    try {
      // Allow value to be a function (same API as useState)
      const valueToStore = value instanceof Function 
        ? value(storedValue) 
        : value;
      
      // Update React state
      setStoredValue(valueToStore);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        if (valueToStore === null || valueToStore === undefined) {
          // Remove item if value is null/undefined
          window.localStorage.removeItem(key);
        } else {
          // Store as JSON string
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
      
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  /**
   * Remove value from both state and localStorage
   * Resets to initial value
   */
  const removeValue = () => {
    try {
      // Reset to initial value
      setStoredValue(initialValue);
      
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  /**
   * Sync state when localStorage changes in other tabs/windows
   */
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e) => {
      // Only handle changes to our specific key
      if (e.key !== key) {
        return;
      }

      try {
        // Handle edge cases
        if (e.newValue === null || 
            e.newValue === undefined || 
            e.newValue === 'undefined' || 
            e.newValue === 'null') {
          setStoredValue(initialValue);
        } else {
          // Parse and update state
          setStoredValue(JSON.parse(e.newValue));
        }
        
      } catch (error) {
        console.error(`Error parsing storage event for key "${key}":`, error);
        setStoredValue(initialValue);
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
