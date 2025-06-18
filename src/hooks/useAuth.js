'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorage from './useLocalStorage';
import useApi from './useApi';

// Create context
const AuthContext = createContext(null);

/**
 * Auth provider component to wrap around your app
 */
export function AuthProvider({ children }) {
  const router = useRouter();
  const api = useApi();
  
  // FIXED: Use consistent localStorage keys
  const [token, setToken, removeToken] = useLocalStorage('authToken', null);
  const [user, setUser, removeUser] = useLocalStorage('userData', null);
  
  // Additional state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user]);

  // FIXED: Updated logout function to redirect to homepage
  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Call the logout API to invalidate server-side session
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with client-side logout even if API fails
    }
    
    // Clear client-side auth data
    removeToken();
    removeUser();
    
    // Dispatch custom event to notify other components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    
    setIsLoading(false);
    
    // Always redirect to homepage after logout
    router.push('/');
    
  }, [removeToken, removeUser, api, router]);

  // FIXED: Token validation with proper dependencies and continuous checking
  useEffect(() => {
    let intervalId;

    const validateToken = () => {
      if (token) {
        try {
          // Decode JWT to check expiration
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();
          const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
          
          if (currentTime >= expirationTime) {
            console.log('Token expired, logging out');
            logout();
            return false;
          } else if (currentTime >= (expirationTime - bufferTime)) {
            console.log('Token expiring soon, consider refreshing');
            // You could implement token refresh here
            return false;
          }
          return true;
        } catch (error) {
          console.error('Error checking token expiration:', error);
          logout();
          return false;
        }
      }
      return false;
    };

    // Initial validation
    validateToken();

    // FIXED: Set up periodic token validation (every 5 minutes)
    if (token) {
      intervalId = setInterval(validateToken, 5 * 60 * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [token, logout]);

  /**
   * Register a new user
   */
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/register', userData);
      
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        
        // Dispatch auth change event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        
        return response.data;
      } else {
        setError(response.message || 'Registration failed');
        return null;
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Log in a user
   */
  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        
        // Dispatch auth change event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        
        return response.data;
      } else {
        setError(response.message || 'Login failed');
        return null;
      }
    } catch (error) {
      setError(error.message || 'Login failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update the user profile
   */
  const updateProfile = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/api/users/profile', userData);
      
      if (response.success) {
        // Update user data in state and localStorage
        setUser(response.data.user);
        return response.data.user;
      } else {
        setError(response.message || 'Failed to update profile');
        return null;
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request a password reset
   */
  const requestPasswordReset = async (email) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/password-reset/request', { email });
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to request password reset');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Failed to request password reset');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/auth/password-reset', data);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Failed to reset password');
        return false;
      }
    } catch (error) {
      setError(error.message || 'Failed to reset password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare the value object to be provided to consumers
  const value = {
    isAuthenticated,
    user,
    token,
    isLoading,
    error,
    register,
    login,
    logout,
    updateProfile,
    requestPasswordReset,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

export { AuthContext };