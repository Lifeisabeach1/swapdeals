// 13. lib/utils/response.js - API Response helpers

/**
 * Standard API response helpers
 */
const responseHelpers = {
  /**
   * Success response
   * @param {Object} res - Express response object
   * @param {any} data - Response data
   * @param {number} status - HTTP status code
   * @returns {Object} Response object
   */
  success: (res, data = null, status = 200) => {
    return res.status(status).json({
      success: true,
      data
    });
  },
  
  /**
   * Error response
   * @param {Object} res - Express response object
   * @param {string|Object} error - Error message or object
   * @param {number} status - HTTP status code
   * @returns {Object} Response object
   */
  error: (res, error = 'An error occurred', status = 400) => {
    const errorMessage = error instanceof Error ? error.message : error;
    
    return res.status(status).json({
      success: false,
      error: errorMessage
    });
  },
  
  /**
   * Not found response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @returns {Object} Response object
   */
  notFound: (res, message = 'Resource not found') => {
    return responseHelpers.error(res, message, 404);
  },
  
  /**
   * Unauthorized response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @returns {Object} Response object
   */
  unauthorized: (res, message = 'Unauthorized') => {
    return responseHelpers.error(res, message, 401);
  },
  
  /**
   * Forbidden response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @returns {Object} Response object
   */
  forbidden: (res, message = 'Forbidden') => {
    return responseHelpers.error(res, message, 403);
  }
};

module.exports = responseHelpers;