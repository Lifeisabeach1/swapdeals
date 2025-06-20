// app/api/dashboard/users/[id]/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';

// GET handler to retrieve a specific user
export async function GET(request, { params }) {
  try {
    const userId = params.id;
    
    const user = await knex('users').where({ id: userId }).first();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT handler to update a specific user
export async function PUT(request, { params }) {
  try {
    const userId = params.id;
    const data = await request.json();
    
    // Check if user exists
    const user = await knex('users').where({ id: userId }).first();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // If updating email, check it's not already taken
    if (data.email && data.email !== user.email) {
      const existingUser = await knex('users').where({ email: data.email }).first();
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 409 }
        );
      }
    }
    
    // Update user
    await knex('users')
      .where({ id: userId })
      .update({
        ...data,
        updated_at: new Date()
      });
    
    const updatedUser = await knex('users').where({ id: userId }).first();
    
    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a specific user
export async function DELETE(request, { params }) {
  try {
    const userId = params.id;
    
    // Check if user exists
    const user = await knex('users').where({ id: userId }).first();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Delete user
    await knex('users').where({ id: userId }).del();
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error deleting user ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}