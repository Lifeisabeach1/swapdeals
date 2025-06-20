import { NextResponse } from 'next/server';
import db from '@/lib/db/knex';

// GET handler for retrieving all users
export async function GET(request) {
  try {
    const users = await db('users').select('*');
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new user
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Check if email already exists
    const existingUser = await db('users').where({ email: data.email }).first();
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    // Insert new user
    const [userId] = await db('users').insert({
      name: data.name,
      email: data.email,
      role: data.role || 'user',
      created_at: new Date(),
      updated_at: new Date()
    }).returning('id');
    
    const newUser = await db('users').where({ id: userId }).first();
    
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// For a specific user, use a dynamic route: app/api/dashboard/users/[id]/route.js