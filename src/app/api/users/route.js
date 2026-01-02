// app/api/users/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { headers } from 'next/headers'; // ← LÄGG TILL
import { verifyToken } from '@/lib/auth/jwt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET - List users (Admin only)
export async function GET(request) {
  try {
    // ← FIX: Verify auth med headers()
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin access required' 
      }, { status: 403 });
    }
    
    // Parse filters
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    
    // Build query
    let query = supabase.from('users').select('*');
    
    if (isActive !== null) query = query.eq('is_active', isActive === 'true');
    if (role) query = query.eq('role', role);
    if (search) query = query.or(`username.ilike.%${search}%,email.ilike.%${search}%`);
    
    const { data: users, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to fetch users' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST - Create user (Admin only)
export async function POST(request) {
  try {
    // ← FIX: Verify auth med headers()
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin access required' 
      }, { status: 403 });
    }
    
    const body = await request.json();
    
    // Create user (you'll need to implement password hashing)
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email: body.email,
        username: body.username,
        password: body.password, // Should be hashed!
        first_name: body.first_name,
        last_name: body.last_name,
        role: body.role || 'user',
        is_active: body.is_active !== undefined ? body.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to create user' 
      }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: user
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}