// src/lib/utils/errorHandler.js
import { NextResponse } from 'next/server';

/**
 * Standardized error response handler
 */
export class APIError extends Error {
  constructor(message, statusCode = 500, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'APIError';
  }
}

/**
 * Handle database errors and return appropriate HTTP responses
 */
export function handleDatabaseError(error) {
  console.error('Database error:', error);

  // PostgreSQL error codes
  switch (error.code) {
    case '23503': // Foreign key violation
      return new APIError('Referenced record not found', 400, 'FOREIGN_KEY_VIOLATION');
    
    case '23505': // Unique violation
      return new APIError('Duplicate entry', 409, 'DUPLICATE_ENTRY');
    
    case '23502': // Not null violation
      return new APIError('Required field is missing', 400, 'MISSING_REQUIRED_FIELD');
    
    case '42P01': // Undefined table
      return new APIError('Database table not found', 500, 'TABLE_NOT_FOUND');
    
    case '28P01': // Invalid password
      return new APIError('Database authentication failed', 500, 'DB_AUTH_FAILED');
    
    case 'ECONNREFUSED':
      return new APIError('Database connection refused', 500, 'DB_CONNECTION_REFUSED');
    
    default:
      return new APIError('Database operation failed', 500, 'DATABASE_ERROR');
  }
}

/**
 * Create standardized error response
 */
export function createErrorResponse(error) {
  let apiError;
  
  if (error instanceof APIError) {
    apiError = error;
  } else if (error.code) {
    apiError = handleDatabaseError(error);
  } else {
    apiError = new APIError(error.message || 'Internal server error', 500);
  }

  return NextResponse.json({
    success: false,
    message: apiError.message,
    error: {
      code: apiError.code,
      statusCode: apiError.statusCode
    }
  }, { status: apiError.statusCode });
}

/**
 * Async error wrapper for API routes
 */
export function asyncHandler(fn) {
  return async (req, res) => {
    try {
      return await fn(req, res);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}