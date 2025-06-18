// 15. lib/utils/constants.js

module.exports = {
  // User roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    EDITOR: 'editor'
  },
  
  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  },
  
  // Authentication constants
  AUTH: {
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 100,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30
  }
};