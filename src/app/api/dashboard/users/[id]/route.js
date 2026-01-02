// app/api/dashboard/users/[id]/route.js
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

// GET handler to retrieve a specific user
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }
    
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT handler to update a specific user
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }
    
    const data = await request.json();
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // If updating email, check it's not already taken
    if (data.email && data.email !== user.email) {
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
    }
    
    // Update user
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a specific user
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Verify admin access
    const authResult = await verifyAdminAccess(request);
    if (authResult.error) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: authResult.status }
      );
    }
    
    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete user
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return NextResponse.json(
        { success: false, message: 'Failed to delete user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}