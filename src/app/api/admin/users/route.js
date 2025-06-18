// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { knex } from '@/lib/db/index.js';

async function authenticateAdmin(request) {
  console.log('=== ADMIN AUTH START ===');
  
  const authHeader = request.headers.get('Authorization');
  console.log('Auth header present:', !!authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  
  const token = authHeader.substring(7);
  console.log('Token length:', token.length);
  
  if (token.length < 20) {
    console.log('Token too short:', token);
    throw new Error('Malformed token');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded, user ID:', decoded.id);
    
    // FIXED: Query the correct columns
    const user = await knex('users')
      .select('id', 'username', 'email', 'role', 'is_active')
      .where('id', decoded.id)
      .first();
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.is_active) {
      throw new Error('Account is not active');
    }
    
    // FIXED: Check role correctly
    if (user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    console.log('Admin authentication successful:', user.username);
    return user;
    
  } catch (jwtError) {
    console.error('JWT verification failed:', jwtError.message);
    throw new Error('Invalid token');
  }
}

export async function GET(request) {
  try {
    // Authenticate admin
    await authenticateAdmin(request);
    
    // FIXED: Get all user data including role information
    const users = await knex('users')
      .select([
        'id',
        'username', 
        'email',
        'first_name',
        'last_name', 
        'role',
        'is_active',
        'created_at',
        'last_login_at'
      ])
      .orderBy('created_at', 'desc');
    
    // Add computed fields for frontend compatibility
    const usersWithComputedFields = users.map(user => ({
      ...user,
      name: user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.username,
      banned: !user.is_active,
      status: user.is_active ? 'active' : 'banned'
    }));
    
    console.log(`Retrieved ${users.length} users`);
    
    return NextResponse.json({
      success: true,
      users: usersWithComputedFields
    });
    
  } catch (error) {
    console.error('Admin users API error:', error);
    
    if (error.message.includes('token') || error.message.includes('Auth')) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 });
  }
}

