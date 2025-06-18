import { object, string, ref, boolean, number } from 'yup';
/**
 * Base schema for user validation
 */
export const userBaseSchema = object({
  name: string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
    
  email: string()
    .email('Invalid email address')
    .required('Email is required')
    .max(255, 'Email cannot exceed 255 characters'),
    
  role: string()
    .oneOf(['user', 'admin', 'editor'], 'Invalid role')
    .default('user'),
    
  bio: string()
    .max(500, 'Bio cannot exceed 500 characters')
    .nullable(),
    
  avatar: string()
    .url('Avatar must be a valid URL')
    .nullable(),
    
  isActive: boolean()
    .default(true),
});
/**
 * Schema for creating a new user
 */
export const createUserSchema = userBaseSchema.shape({
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-ö])(?=.*[A-Ö])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
    
  acceptTerms: boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});
/**
 * Schema for updating a user
 */
export const updateUserSchema = userBaseSchema.shape({
  id: number()
    .required('User ID is required'),
    
  password: string()
    .optional()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    
  confirmPassword: string()
    .when('password', {
      is: (val) => val && val.length > 0,
      then: (schema) => schema
        .oneOf([ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
      otherwise: (schema) => schema.optional(),
    }),
});
/**
 * Schema for user login
 */
export const loginSchema = object({
  email: string()
    .email('Invalid email address')
    .required('Email is required'),
    
  password: string()
    .required('Password is required'),
    
  rememberMe: boolean()
    .default(false),
});
/**
 * Schema for password reset request
 */
export const passwordResetRequestSchema = object({
  email: string()
    .email('Invalid email address')
    .required('Email is required'),
});
/**
 * Schema for password reset
 */
export const passwordResetSchema = object({
  token: string()
    .required('Reset token is required')
    .min(20, 'Invalid token'),
    
  password: string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
    
  confirmPassword: string()
    .oneOf([ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});