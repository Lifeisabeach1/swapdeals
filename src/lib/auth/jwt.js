// lib/auth/jwt.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Validate JWT_SECRET exists
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required but not set');
}

// Warn if using default/weak secret in production
if (process.env.NODE_ENV === 'production' && JWT_SECRET === 'your-secret-key') {
  console.warn('⚠️  WARNING: Using default JWT secret in production is insecure!');
}

/**
 * Generate a JWT token
 * @param {Object} payload - Token payload
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  } catch (error) {
    console.error('JWT generation failed:', error);
    throw new Error('Failed to generate JWT token');
  }
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

// Default export for backward compatibility
const jwtUtils = {
  generate: generateToken,
  verify: verifyToken,
  generateToken,
  verifyToken
};

export default jwtUtils;