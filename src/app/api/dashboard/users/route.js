// app/api/dashboard/users/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';

// GET handler for retrieving all users
export async function GET(request) {
  try {
    const users = await knex('users').select('*');
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
    const existingUser = await knex('users').where({ email: data.email }).first();
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    // Insert new user
    const [userId] = await knex('users').insert({
      name: data.name,
      email: data.email,
      role: data.role || 'user',
      created_at: new Date(),
      updated_at: new Date()
    }).returning('id');
    
    const newUser = await knex('users').where({ id: userId }).first();
    
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