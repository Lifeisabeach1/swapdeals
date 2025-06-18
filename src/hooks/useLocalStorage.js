'use client';

import { useState, useEffect } from 'react';

/**
 * A hook for accessing and manipulating localStorage with a fallback for server-side rendering
 * 
 * @param {string} key - The key to store the value under in localStorage
 * @param {any} initialValue - The initial value to use if no value is found in localStorage
 * @returns {[any, function, function]} - A tuple containing the current value, a setter function, and a remove function
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        
        // Handle null, undefined, or "undefined" string cases
        if (item === null || item === undefined || item === 'undefined' || item === 'null') {
          return initialValue;
        }
        
        // Parse stored json or if none return initialValue
        return JSON.parse(item);
      }
      return initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      
      // Clean up the corrupted value
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.removeItem(key);
        } catch (removeError) {
          console.error(`Error removing corrupted localStorage key "${key}":`, removeError);
        }
      }
      
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        // Handle null/undefined values by removing the item
        if (valueToStore === null || valueToStore === undefined) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the item from localStorage
  const removeValue = () => {
    try {
      // Save state
      setStoredValue(initialValue);
      
      // Remove from local storage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to this localStorage value across browser windows/tabs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = (e) => {
        if (e.key === key) {
          try {
            // Handle the same edge cases for storage events
            if (e.newValue === null || e.newValue === undefined || e.newValue === 'undefined' || e.newValue === 'null') {
              setStoredValue(initialValue);
            } else {
              setStoredValue(JSON.parse(e.newValue));
            }
          } catch (error) {
            console.error(`Error parsing localStorage change for key "${key}":`, error);
            setStoredValue(initialValue);
          }
        }
      };

      // Add event listener
      window.addEventListener('storage', handleStorageChange);
      
      // Clean up
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;