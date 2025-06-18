// app/api/users/route.js

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
// import User from '@/lib/db/models/User';

/**
 * Get users - Admin only
 * @route GET /api/users
 */
async function getUsers(req) {
  try {
    // Parse query parameters
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    
    const filters = {
      isActive: searchParams.get('isActive') === 'true' ? true : 
                searchParams.get('isActive') === 'false' ? false : undefined,
      role: searchParams.get('role') || undefined,
      search: searchParams.get('search') || undefined
    };
    
    // Get users with filters
    const users = await User.findAll(filters);
    
    return NextResponse.json({
      success: true,
      data: users
    }, { status: 200 });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * Create user - Admin only
 * @route POST /api/users
 */
async function createUser(req) {
  try {
    const body = await req.json();
    
    // Create user
    const user = await User.create({
      email: body.email,
      username: body.username,
      password: body.password,
      first_name: body.first_name,
      last_name: body.last_name,
      role: body.role || 'user',
      is_active: body.is_active !== undefined ? body.is_active : true
    });
    
    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Wrap handlers with admin middleware - FIXED: Use requireAdmin directly
export const GET = requireAdmin(getUsers);
export const POST = requireAdmin(createUser);