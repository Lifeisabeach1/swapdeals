// src/app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db/knex';
import { knex } from '@/lib/db/index.js';
import { validate } from '@/lib/validations/auth';

/**
 * POST /api/auth/register
 * Registers a new user (without auto-login)
 */
export async function POST(request) {
  try {
    console.log('=== Registration Start ===');
    
    // Parse request body
    const body = await request.json();
    console.log('Received body:', body);
    
    // Validate input using your existing validation
    const { data, errors } = validate('register', body);
    
    if (errors) {
      console.log('Validation errors:', errors);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors
        }, 
        { status: 400 }
      );
    }
    
    console.log('Validation passed');
    
    // Test database connection
    try {
      await db.raw('SELECT 1');
      console.log('Database connection successful');
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }
    
    // Check if email already exists
    console.log('Checking for existing user with email:', data.email);
    const existingUser = await db('users')
      .where({ email: data.email })
      .first();
    
    if (existingUser) {
      console.log('User already exists with email:', data.email);
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Check if username already exists
    console.log('Checking for existing user with username:', data.username);
    const existingUsername = await db('users')
      .where({ username: data.username })
      .first();
    
    if (existingUsername) {
      console.log('User already exists with username:', data.username);
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 409 }
      );
    }
    
    console.log('Email and username are available');
    
    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    console.log('Password hashed successfully');
    
    // Create user data
    const userData = {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      role: 'user',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    console.log('User data prepared:', { ...userData, password: '[HIDDEN]' });
    
    // Create user and update platform stats in a transaction
    console.log('Creating user and updating platform stats...');
    
    let newUser;
    await knex.transaction(async (trx) => {
      // Create user
      console.log('Inserting user into database...');
      [newUser] = await trx('users')
        .insert(userData)
        .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'created_at']);
      
      console.log('User created successfully:', newUser);
      
      // Update platform stats - increment registered users
      await trx('platform_stats')
        .where('stat_name', 'registered_users')
        .increment('stat_value', 1);
      
      console.log('✅ User registration tracked - incremented registered_users');
    });
    
    console.log('User creation and platform stats update completed');
    
    // Prepare response data (without token - user must login separately)
    const responseData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      role: newUser.role,
      created_at: newUser.created_at,
    };
    
    console.log('=== Registration End - Success ===');
    
    // Return successful response without JWT token
    return NextResponse.json({
      success: true,
      message: 'Registration successful. Please log in with your new account.',
      data: {
        user: responseData,
        // No token provided - user must login separately
        requiresLogin: true
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('=== Registration End - Error ===');
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration', error: error.message },
      { status: 500 }
    );
  }
}