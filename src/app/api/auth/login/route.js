// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db/knex';
import { knex } from '@/lib/db/index.js';
import { validate } from '@/lib/validations/auth';

/**
 * POST /api/auth/login
 * Authenticates a user and returns a JWT token
 */
export async function POST(request) {
  try {
    console.log('=== Login Start ===');
    
    // Parse request body
    const body = await request.json();
    console.log('Received body:', { ...body, password: '[HIDDEN]' });
    
    // Validate input using your existing validation
    const { data, errors } = validate('login', body);
    
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
    
    // Find user by email
    console.log('Looking for user with email:', data.email);
    const user = await db('users')
      .where({ email: data.email })
      .first();
    
    // Check if user exists
    if (!user) {
      console.log('User not found with email:', data.email);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('User found:', { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      is_active: user.is_active 
    });
    
    // Check if user is active
    if (!user.is_active) {
      console.log('User account is deactivated:', user.email);
      return NextResponse.json(
        { success: false, message: 'Your account has been deactivated' },
        { status: 403 }
      );
    }
    
    console.log('User account is active');
    
    // Compare passwords
    console.log('Comparing passwords...');
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    
    if (!isPasswordValid) {
      console.log('Password validation failed for user:', user.email);
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log('Password validation successful');
    
    // Create JWT token
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    console.log('Creating JWT token...');
    
    // Define token expiration (use rememberMe if provided)
    const expiresIn = data.rememberMe ? '30d' : '1d';
    const maxAge = data.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // milliseconds
    console.log('Token expiration set to:', expiresIn);
    
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      secretKey,
      { expiresIn }
    );
    
    console.log('JWT token created successfully');
    
    // Calculate expiration date for session storage
    const expirationDate = new Date();
    if (data.rememberMe) {
      expirationDate.setDate(expirationDate.getDate() + 30); // 30 days
    } else {
      expirationDate.setDate(expirationDate.getDate() + 1); // 1 day
    }
    
    // Get client IP and user agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(', ')[0] : request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Update last login timestamp, platform stats, and store session in a transaction
    console.log('Updating last login timestamp, platform stats, and storing session...');
    
    await knex.transaction(async (trx) => {
      // Update user's last login
      await trx('users')
        .where({ id: user.id })
        .update({
          last_login_at: new Date(),
          updated_at: new Date()
        });
      
      // Update platform stats - increment total visits only
      await trx('platform_stats')
        .where('stat_name', 'total_visits')
        .increment('stat_value', 1);
      
      // Store session in database
      try {
        await trx('sessions').insert({
          user_id: user.id,
          token: token,
          expires_at: expirationDate,
          ip_address: ip,
          user_agent: userAgent,
          created_at: new Date(),
          last_used_at: new Date(),
          is_active: true
        });
        console.log('✅ Session stored in database');
      } catch (sessionError) {
        console.error('⚠️ Failed to store session:', sessionError);
        // Continue anyway - session storage is not critical for login
        // but we might want to log this for monitoring
      }
      
      console.log('✅ User login tracked - incremented total_visits');
    });
    
    console.log('Last login timestamp, platform stats updated, and session stored');
    
    // Prepare response data
    const responseData = {
      id: user.id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      created_at: user.created_at,
      last_login_at: new Date()
    };
    
    console.log('Setting auth_token cookie...');
    
    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token, // Still include in response for client-side access if needed
        user: responseData,
      }
    }, { status: 200 });
    
    // Set HTTP-only cookie with the JWT token
    response.cookies.set('auth_token', token, {
      httpOnly: true, // Prevents client-side JavaScript access (security)
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: maxAge, // Cookie expiration
      path: '/', // Available site-wide
    });
    
    console.log('✅ Auth cookie set successfully');
    console.log('=== Login End - Success ===');
    
    return response;
    
  } catch (error) {
    console.error('=== Login End - Error ===');
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, message: 'An error occurred during login', error: error.message },
      { status: 500 }
    );
  }
}