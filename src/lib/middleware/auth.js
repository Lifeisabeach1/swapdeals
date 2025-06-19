// src/lib/middleware/auth.js
import jwt from 'jsonwebtoken';
import { knex } from '@/lib/db/index.js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const authenticateUser = async (request) => {
  try {
    console.log('=== AUTHENTICATION START ===');
    
    let token;
    
    // First try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    console.log('Auth header present:', !!authHeader);
    console.log('Auth header value:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and trim
      console.log('Token extracted from header, length:', token?.length);
    }
    
    // If no header token, try cookies as fallback (App Router way)
    if (!token) {
      console.log('No Authorization header, checking cookies...');
      try {
        const cookieStore = cookies();
        token = cookieStore.get('auth_token')?.value;
        if (token) {
          console.log('Token extracted from cookie, length:', token?.length);
        }
      } catch (cookieError) {
        console.log('Cookie access failed:', cookieError.message);
      }
    }
    
    if (!token) {
      throw new APIError('No token provided in header or cookies', 401, 'AUTH_FAILED');
    }

    // Sanitize token
    const cleanToken = sanitizeToken(token);
    if (!cleanToken) {
      throw new APIError('Malformed token provided', 401, 'MALFORMED_TOKEN');
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      console.log('Token decoded successfully, userId:', decoded.userId);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      
      if (jwtError.name === 'TokenExpiredError') {
        throw new APIError('Token has expired', 401, 'TOKEN_EXPIRED');
      } else if (jwtError.name === 'JsonWebTokenError') {
        throw new APIError('Invalid token', 401, 'INVALID_TOKEN');
      } else {
        throw new APIError('Token verification failed', 401, 'AUTH_FAILED');
      }
    }

    // Check if user ID exists in decoded token
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.error('No user ID found in token payload:', decoded);
      throw new APIError('Invalid token payload - missing user ID', 401, 'INVALID_TOKEN');
    }

    console.log('Querying user with ID:', userId);
    
    // Get user from database
    const user = await knex('users')
      .select('id', 'username', 'email', 'is_active', 'role')
      .where('id', userId)
      .first();

    console.log('User query result:', user ? 'Found' : 'Not found');

    if (!user) {
      throw new APIError('User not found', 401, 'USER_NOT_FOUND');
    }

    // Check if user account is active
    if (!user.is_active) {
      throw new APIError('User account is not active', 401, 'ACCOUNT_INACTIVE');
    }

    // Add computed is_admin property for backward compatibility
    user.is_admin = user.role === 'admin';

    console.log('=== AUTHENTICATION SUCCESS ===');
    return {
      user,
      token: decoded
    };

  } catch (error) {
    console.error('=== AUTHENTICATION ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('===============================');
    
    // Re-throw APIError as-is
    if (error instanceof APIError) {
      throw error;
    }
    
    // Handle unexpected errors
    throw new APIError('Authentication failed', 401, 'AUTH_FAILED');
  }
};

// Token sanitization for malformed tokens
export const sanitizeToken = (token) => {
  if (!token) {
    console.log('No token provided to sanitize');
    return null;
  }
  
  // Handle case where token might be the string "null"
  if (token === 'null' || token === null) {
    console.log('Token is null string or null value');
    return null;
  }
  
  let cleanToken = String(token).trim();
  console.log('Original token length:', cleanToken.length);
  
  // Remove Bearer prefix if present
  if (cleanToken.startsWith('Bearer ')) {
    cleanToken = cleanToken.substring(7).trim();
  }
  
  // Remove any quotes that might have been added
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  
  // Remove any extra whitespace or newlines
  cleanToken = cleanToken.replace(/\s/g, '');
  
  // Check minimum length
  if (cleanToken.length < 20) {
    console.log('Token too short after cleaning:', cleanToken.length, 'chars');
    return null;
  }
  
  // Check if token looks like a JWT (should have 3 parts separated by dots)
  const parts = cleanToken.split('.');
  if (parts.length !== 3) {
    console.log('Token does not have 3 parts, appears malformed. Parts:', parts.length);
    return null;
  }
  
  console.log('Token sanitized successfully, length:', cleanToken.length);
  return cleanToken;
};

// Helper function to verify token (App Router compatible)
export const verifyToken = async (token) => {
  try {
    const cleanToken = sanitizeToken(token);
    
    if (!cleanToken) {
      console.log('No clean token after sanitization');
      return null;
    }
    
    console.log('Verifying sanitized token, length:', cleanToken.length);
    
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      console.log('No user ID in token');
      return null;
    }

    // Use consistent column names
    const user = await knex('users')
      .select('id', 'username', 'email', 'is_active', 'role')
      .where('id', userId)
      .first();

    if (!user || !user.is_active) {
      console.log('User not found or inactive');
      return null;
    }

    // Add computed is_admin property
    user.is_admin = user.role === 'admin';

    return user;
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

// Basic auth middleware - THIS WAS MISSING
export const withAuth = (handler) => {
  return async (request, context) => {
    try {
      const auth = await authenticateUser(request);
      
      // Add user info to the request context
      request.auth = auth;
      
      return await handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Authentication failed',
          code: error.code || 'AUTH_FAILED'
        },
        {
          status: error.statusCode || 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
};

// App Router compatible admin middleware
export const requireAdmin = (handler) => {
  return async (request, context) => {
    try {
      console.log('=== ADMIN AUTH START ===');
      
      // Check if user is authenticated
      const authHeader = request.headers.get('authorization');
      console.log('Auth header present:', !!authHeader);
      console.log('Auth header:', authHeader);
      
      if (!authHeader || authHeader === 'null') {
        console.log('No authorization header or null header');
        return NextResponse.json({
          success: false,
          error: 'Authentication required'
        }, { status: 401 });
      }

      // Extract and verify token
      let token = authHeader;
      if (token.startsWith('Bearer ')) {
        token = token.substring(7).trim();
      }
      
      console.log('Extracted token length:', token.length);
      console.log('Token value:', token);
      
      // Check for obviously malformed tokens
      if (token.length < 20 || token === 'null') {
        console.log('Token too short or null, likely malformed:', token);
        return NextResponse.json({
          success: false,
          error: 'Malformed token'
        }, { status: 401 });
      }
      
      const user = await verifyToken(token);
      
      if (!user) {
        console.log('Token verification failed');
        return NextResponse.json({
          success: false,
          error: 'Invalid token'
        }, { status: 401 });
      }

      console.log('User verified:', user.username, 'Admin:', user.is_admin);

      // Check if user is admin
      if (!user.is_admin) {
        console.log('User is not admin');
        return NextResponse.json({
          success: false,
          error: 'Admin access required'
        }, { status: 403 });
      }

      // Add user to request object (App Router way)
      request.user = user;
      
      console.log('=== ADMIN AUTH SUCCESS ===');
      
      // Call the original handler
      return await handler(request, context);
    } catch (error) {
      console.error('Admin auth middleware error:', error);
      return NextResponse.json({
        success: false,
        error: 'Authentication failed'
      }, { status: 401 });
    }
  };
};

// Combined middleware for App Router
export const withAuthAndAdmin = (handler, options = {}) => {
  return async (request, context) => {
    try {
      const auth = await authenticateUser(request);
      
      // Check admin requirement
      if (options.requireAdmin && !auth.user.is_admin) {
        return NextResponse.json(
          {
            success: false,
            message: 'Admin access required',
            code: 'ADMIN_REQUIRED'
          },
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      }
      
      // Add user info to the request context
      request.auth = auth;
      
      return await handler(request, context);
    } catch (error) {
      console.error('Auth middleware error:', error);
      
      return NextResponse.json(
        {
          success: false,
          message: error.message || 'Authentication failed',
          code: error.code || 'AUTH_FAILED'
        },
        {
          status: error.statusCode || 401,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  };
};