// app/api/admin/users/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, role, is_active')
      .eq('id', decoded.id)
      .single();
    
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error fetching user:', userError);
      throw new Error('Database error');
    }
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.is_active) {
      throw new Error('Account is not active');
    }
    
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

// GET - Fetch all users
export async function GET(request) {
  try {
    await authenticateAdmin(request);
    
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        username,
        email,
        first_name,
        last_name,
        role,
        is_active,
        created_at,
        last_login_at
      `)
      .order('created_at', { ascending: false });
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw new Error('Failed to fetch users from database');
    }
    
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
