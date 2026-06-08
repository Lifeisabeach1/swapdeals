// lib/middleware/auth.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'APIError';
  }
}

/**
 * Extract token from request headers
 * @param {Request} request - Next.js request object
 * @returns {string|null} Token string or null if not found
 */
const getToken = (request) => {
  const authHeader = request.headers.get('authorization');
  
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  
  return null;
};

/**
 * Get authenticated user from token
 * @param {string} token - JWT token
 * @returns {Promise<Object|null>} User object or null
 */
const getAuthUser = async (token) => {
  if (!token) return null;
  
  try {
    // Verify JWT token
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Fetch user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, role, is_active')
      .eq('id', decoded.id)
      .single();
    
    // Return null if user not found or inactive
    if (error || !user || !user.is_active) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
};

/**
 * Middleware to require authentication
 * Verifies that user is logged in
 * 
 * @example
 * export const GET = withAuth(async (request) => {
 *   console.log('User:', request.user);
 *   return NextResponse.json({ data: 'protected' });
 * });
 */
export const withAuth = (handler) => {
  return async (request, context) => {
    try {
      const token = getToken(request);
      const user = await getAuthUser(token);
      
      if (!user) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Autentisering krävs' 
          },
          { status: 401 }
        );
      }
      
      // Add user to request object
      request.user = user;
      
      // Call the wrapped handler
      return await handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Autentisering misslyckades' 
        },
        { status: 401 }
      );
    }
  };
};

/**
 * Middleware to require admin role
 * Verifies that user is logged in AND has admin role
 * 
 * @example
 * export const GET = withAdmin(async (request) => {
 *   console.log('Admin user:', request.user);
 *   return NextResponse.json({ data: 'admin only' });
 * });
 */
export const withAdmin = (handler) => {
  return async (request, context) => {
    try {
      const token = getToken(request);
      const user = await getAuthUser(token);
      
      // Check if user exists
      if (!user) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Autentisering krävs' 
          },
          { status: 401 }
        );
      }
      
      // Check if user has admin role
      if (user.role !== 'admin') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Admin-behörighet krävs' 
          },
          { status: 403 }
        );
      }
      
      // Add user to request object
      request.user = user;
      
      // Call the wrapped handler
      return await handler(request, context);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Autentisering misslyckades' 
        },
        { status: 401 }
      );
    }
  };
};

/**
 * Optional authentication middleware
 * Adds user to request if token exists, but doesn't require authentication
 * Useful for endpoints that work differently for logged-in vs anonymous users
 * 
 * @example
 * export const GET = withOptionalAuth(async (request) => {
 *   if (request.user) {
 *     console.log('Logged in as:', request.user.username);
 *   } else {
 *     console.log('Anonymous user');
 *   }
 *   return NextResponse.json({ data: 'public or private' });
 * });
 */
export const withOptionalAuth = (handler) => {
  return async (request, context) => {
    try {
      const token = getToken(request);
      const user = await getAuthUser(token);
      
      // Add user to request (can be null)
      request.user = user;
      
      return await handler(request, context);
    } catch (error) {
      console.error('Optional auth error:', error);
      // Set user as null and continue
      request.user = null;
      return await handler(request, context);
    }
  };
};

/**
 * Helper function to verify admin directly (for use in route handlers)
 * Returns user object or throws APIError
 * 
 * @example
 * export async function POST(request) {
 *   try {
 *     const adminUser = await requireAdmin(request);
 *     // ... admin logic
 *   } catch (error) {
 *     if (error instanceof APIError) {
 *       return NextResponse.json({ error: error.message }, { status: error.statusCode });
 *     }
 *     throw error;
 *   }
 * }
 */
export const requireAdmin = async (request) => {
  const token = getToken(request);
  const user = await getAuthUser(token);
  
  if (!user) {
    throw new APIError('Autentisering krävs', 401);
  }
  
  if (user.role !== 'admin') {
    throw new APIError('Admin-behörighet krävs', 403);
  }
  
  return user;
};

/**
 * Helper function to verify authentication directly (for use in route handlers)
 * Returns user object or throws APIError
 * 
 * @example
 * export async function POST(request) {
 *   try {
 *     const user = await requireAuth(request);
 *     // ... authenticated logic
 *   } catch (error) {
 *     if (error instanceof APIError) {
 *       return NextResponse.json({ error: error.message }, { status: error.statusCode });
 *     }
 *     throw error;
 *   }
 * }
 */
export const requireAuth = async (request) => {
  const token = getToken(request);
  const user = await getAuthUser(token);
  
  if (!user) {
    throw new APIError('Autentisering krävs', 401);
  }
  
  return user;
};

/**
 * Middleware to check ownership of a resource
 * Verifies user is authenticated and either owns the resource or is an admin
 * 
 * @param {Function} getResourceUserId - Function that returns the user_id of the resource
 * @example
 * export const PUT = withOwnership(
 *   async (params) => {
 *     const { data } = await supabase
 *       .from('trade_listings')
 *       .select('user_id')
 *       .eq('id', params.id)
 *       .single();
 *     return data?.user_id;
 *   },
 *   async (request, context) => {
 *     // User is either owner or admin
 *     return NextResponse.json({ success: true });
 *   }
 * );
 */
export const withOwnership = (getResourceUserId, handler) => {
  return async (request, context) => {
    try {
      const token = getToken(request);
      const user = await getAuthUser(token);
      
      if (!user) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Autentisering krävs' 
          },
          { status: 401 }
        );
      }
      
      // Get the resource's user_id
      const resourceUserId = await getResourceUserId(context?.params || {});
      
      // Check if user is owner or admin
      if (user.id !== resourceUserId && user.role !== 'admin') {
        return NextResponse.json(
          { 
            success: false,
            error: 'Du har inte behörighet att ändra denna resurs' 
          },
          { status: 403 }
        );
      }
      
      // Add user to request
      request.user = user;
      
      return await handler(request, context);
    } catch (error) {
      console.error('Ownership middleware error:', error);
      return NextResponse.json(
        { 
          success: false,
          error: 'Autentisering misslyckades' 
        },
        { status: 401 }
      );
    }
  };
};


