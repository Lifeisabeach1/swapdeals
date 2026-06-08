// hooks/useAuth.js
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from '@/hooks/useLocalStorage';

// Create and export the context
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  
  // Use localStorage hook instead of manual localStorage management
  const [token, setToken, removeToken] = useLocalStorage('authToken', null);
  const [user, setUser, removeUser] = useLocalStorage('userData', null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API call helper
  const apiCall = async (endpoint, options = {}) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  };

  /**
   * Register a new user
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiCall('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      // Auto-login after successful registration
      if (data.token && data.user) {
        setToken(data.token);  // ← Automatically saved to localStorage
        setUser(data.user);    // ← Automatically saved to localStorage
        window.dispatchEvent(new Event('authChange'));
      }

      return data;
      
    } catch (err) {
      const errorMessage = err.message.includes('redan registrerad') || err.message.includes('redan taget')
        ? err.message
        : err.message.includes('E-post') || err.message.includes('Användarnamn')
        ? err.message
        : err.message.includes('Invalid email')
        ? 'Ogiltig e-postadress'
        : 'Registrering misslyckades';
      
      setError(errorMessage);
      return null;
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.token && data.user) {
        setToken(data.token);  // ← Automatically saved to localStorage
        setUser(data.user);    // ← Automatically saved to localStorage
        window.dispatchEvent(new Event('authChange'));
        return data;
      }

      throw new Error('Invalid response');
      
    } catch (err) {
      const errorMessage = err.message.includes('Invalid') || err.message.includes('401')
        ? 'Felaktig e-post eller lösenord'
        : err.message.includes('Felaktig')
        ? err.message
        : 'Inloggning misslyckades';
      
      setError(errorMessage);
      return null;
      
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout and clear auth state
   */
  const logout = useCallback(() => {
    removeToken();  // ← Removes from localStorage and resets state
    removeUser();   // ← Removes from localStorage and resets state
    window.dispatchEvent(new Event('authChange'));
    router.push('/');
  }, [router, removeToken, removeUser]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        isAuthenticated: !!user && !!token,
        register,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
}
