// app/api/dashboard/users/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth/jwt';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper to verify admin access
async function verifyAdminAccess(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Authorization required', status: 401 };
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { error: 'Invalid or expired token', status: 401 };
  }
  
  // Check if user is admin
  const { data: user, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', decoded.id)
    .single();
  
  if (error || !user) {
    return { error: 'User not found', status: 404 };
  }
  
  if (user.role !== 'admin') {
    return { error: 'Admin access required', status: 403 };
  }
  
  return { userId: decoded.id };
}

// GET handler for retrieving all users
export async function GET(request) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch users' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      users 
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new user
export async function POST(request) {
  try {
    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }

    const data = await request.json();
    
    // Basic validation
    if (!data.email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single();
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already exists' },
        { status: 409 }
      );
    }
    
    // Insert new user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        username: data.username || null,
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        role: data.role || 'user',
        avatar_url: data.avatar_url || null,
        bio: data.bio || null,
        location: data.location || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating user:', insertError);
      return NextResponse.json(
        { success: false, message: 'Failed to create user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user: newUser 
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    );
  }
}