// app/api/admin/users/[userId]/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function authenticateAdmin(request) {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, username, email, role, is_active')
      .eq('id', decoded.id)
      .single();
    
    if (userError || !user) {
      throw new Error('User not found');
    }
    
    if (!user.is_active) {
      throw new Error('Account is not active');
    }
    
    if (user.role !== 'admin') {
      throw new Error('Admin access required');
    }
    
    return user;
    
  } catch (jwtError) {
    console.error('JWT verification failed:', jwtError.message);
    throw new Error('Invalid token');
  }
}

// DELETE - Delete a user by ID
export async function DELETE(request, { params }) {
  try {
    // Authenticate admin
    await authenticateAdmin(request);
    
    // Get userId from params (Next.js 15 requires await)
    const { userId } = await params;
    
    console.log('Deleting user:', userId);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }
    
    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id, username, role')
      .eq('id', userId)
      .single();
    
    if (checkError || !existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Prevent deleting admin users
    if (existingUser.role === 'admin') {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete admin users'
      }, { status: 403 });
    }
    
    // Delete user from Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
    
    console.log('User deleted successfully:', userId);
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.message.includes('token') || error.message.includes('Auth')) {
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to delete user'
    }, { status: 500 });
  }
}