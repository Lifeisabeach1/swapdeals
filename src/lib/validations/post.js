// lib/validations/post.js
import { object, string, date, array, number } from 'yup';
import { slugify } from '../index';

/**
 * Base schema for post validation
 */
export const postBaseSchema = object({
  title: string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
    
  content: string()
    .required('Content is required')
    .min(10, 'Content must be at least 10 characters'),
    
  excerpt: string()
    .max(200, 'Excerpt cannot exceed 200 characters'),
    
  status: string()
    .oneOf(['draft', 'published', 'archived'], 'Invalid status')
    .default('draft'),
    
  categoryId: number()
    .nullable(),
    
  tags: array()
    .of(string())
    .max(5, 'Cannot have more than 5 tags'),
    
  publishedAt: date()
    .nullable(),
    
  coverImage: string()
    .url('Cover image must be a valid URL')
    .nullable(),
});

/**
 * Schema for creating a new post
 */
export const createPostSchema = postBaseSchema.shape({
  // Additional fields for creation
  userId: number()
    .required('User ID is required'),
    
  slug: string()
    .transform(function (value, originalValue, context) {
      // Generate slug from title if not provided
      if (!value && context.parent.title) {
        return slugify(context.parent.title);
      }
      return value;
    }),
});

/**
 * Schema for updating an existing post
 */
export const updatePostSchema = postBaseSchema.shape({
  id: number()
    .required('Post ID is required'),
    
  slug: string()
    .transform(function (value, originalValue, context) {
      // Generate slug from title if not provided and title changed
      if (context.parent.title && (!value || context.options?.context?.regenerateSlug)) {
        return slugify(context.parent.title);
      }
      return value;
    }),
});

/**
 * Schema for validating post comment
 */
export const commentSchema = object({
  content: string()
    .required('Comment content is required')
    .min(3, 'Comment must be at least 3 characters')
    .max(1000, 'Comment cannot exceed 1000 characters'),
    
  postId: number()
    .required('Post ID is required'),
    
  userId: number()
    .required('User ID is required'),
    
  parentCommentId: number()
    .nullable(),
});

/**
 * Schema for post search/filtering
 */
export const postFilterSchema = object({
  search: string(),
  
  status: string()
    .oneOf(['draft', 'published', 'archived']),
    
  categoryId: number(),
  
  tags: array()
    .of(string()),
    
  authorId: number(),
    
  startDate: date(),
  
  endDate: date(),
    
  page: number()
    .integer('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
    
  limit: number()
    .integer('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
    
  sortBy: string()
    .oneOf(['createdAt', 'updatedAt', 'publishedAt', 'title'])
    .default('createdAt'),
    
  sortOrder: string()
    .oneOf(['asc', 'desc'])
    .default('desc'),
});

/**
 * Validate post data against schema
 * @param {Object} data - Post data to validate
 * @param {Object} schema - Validation schema
 * @param {Object} options - Validation options
 * @returns {Object} Validated data
 * @throws {Error} Validation error
 */
export async function validatePost(data, schema = createPostSchema, options = {}) {
  try {
    const validatedData = await schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      ...options,
    });
    
    return validatedData;
  } catch (error) {
    throw error;
  }
}