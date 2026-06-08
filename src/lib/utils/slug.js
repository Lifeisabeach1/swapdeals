/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/Å/g, 'a')
    .replace(/Ä/g, 'a')
    .replace(/Ö/g, 'o')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate a unique slug by appending a random string
 * @param {string} text - Text to convert to slug
 * @param {number} length - Length of random string (default: 6)
 * @returns {string} Unique slug
 */
export function generateUniqueSlug(text, length = 6) {
  const baseSlug = generateSlug(text);
  const randomString = Math.random().toString(36).substring(2, 2 + length);
  return `${baseSlug}-${randomString}`;
}

/**
 * Create slug from title with ID
 * @param {string} title - Title text
 * @param {number|string} id - ID to append
 * @returns {string} Slug with ID
 */
export function createSlugWithId(title, id) {
  const slug = generateSlug(title);
  return `${slug}-${id}`;
}
