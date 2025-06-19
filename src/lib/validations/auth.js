// 16. lib/validations/auth.js - using zod for validation

const { z } = require('zod');
const { AUTH } = require('../utils/constants');

// Login schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// Registration schema
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string()
    .min(AUTH.USERNAME_MIN_LENGTH, `Username must be at least ${AUTH.USERNAME_MIN_LENGTH} characters`)
    .max(AUTH.USERNAME_MAX_LENGTH, `Username cannot exceed ${AUTH.USERNAME_MAX_LENGTH} characters`)
    .regex(/^[a-öA-Ö0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens'),
  password: z.string()
    .min(AUTH.PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters`)
    .max(AUTH.PASSWORD_MAX_LENGTH, `Password cannot exceed ${AUTH.PASSWORD_MAX_LENGTH} characters`),
  confirmPassword: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

// Reset password schema
const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string()
    .min(AUTH.PASSWORD_MIN_LENGTH, `Password must be at least ${AUTH.PASSWORD_MIN_LENGTH} characters`)
    .max(AUTH.PASSWORD_MAX_LENGTH, `Password cannot exceed ${AUTH.PASSWORD_MAX_LENGTH} characters`),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

// Forgot password schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

// Validate function for all schemas
const validate = (schema, data) => {
  try {
    return { data: schema.parse(data), errors: null };
  } catch (error) {
    return { 
      data: null, 
      errors: error.errors.reduce((acc, curr) => {
        acc[curr.path[0]] = curr.message;
        return acc;
      }, {})
    };
  }
};

module.exports = {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  validate: (schemaName, data) => {
    switch (schemaName) {
      case 'login':
        return validate(loginSchema, data);
      case 'register':
        return validate(registerSchema, data);
      case 'resetPassword':
        return validate(resetPasswordSchema, data);
      case 'forgotPassword':
        return validate(forgotPasswordSchema, data);
      default:
        throw new Error(`Unknown schema: ${schemaName}`);
    }
  }
};