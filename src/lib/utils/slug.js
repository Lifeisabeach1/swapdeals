// src/lib/utils/slug.js

/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The title to convert to slug
 * @param {number} maxLength - Maximum length of the slug (default: 50)
 * @returns {string} - URL-friendly slug
 */
export function generateSlug(title, maxLength = 50) {
  if (!title || typeof title !== 'string') {
    return `untitled-${Date.now()}`;
  }

  const slug = title
    .toLowerCase()
    .trim()
    // Replace Swedish characters
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    // Remove special characters except spaces and hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, maxLength);

  // Ensure we have something
  const finalSlug = slug || 'untitled';
  
  // Add timestamp for uniqueness
  return `${finalSlug}-${Date.now()}`;
}

/**
 * Parse slug to extract potential ID or timestamp
 * @param {string} slug - The slug to parse
 * @returns {object} - Parsed slug information
 */
export function parseSlug(slug) {
  if (!slug) return { originalSlug: null, timestamp: null, baseSlug: null };

  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  const isTimestamp = /^\d{13}$/.test(lastPart); // 13 digits for timestamp

  return {
    originalSlug: slug,
    timestamp: isTimestamp ? parseInt(lastPart) : null,
    baseSlug: isTimestamp ? parts.slice(0, -1).join('-') : slug
  };
}