import { requireAdmin } from '@/lib/middleware/auth';
import { knex } from '@/lib/db/index.js';
import { NextResponse } from 'next/server';

async function handleGetBans(request) {
  try {
    console.log('=== ADMIN BANS ROUTE ===');
    console.log('Authenticated user:', request.user.username);
    
    // First, let's check if the bans table exists
    const hasTable = await knex.schema.hasTable('bans');
    console.log('Bans table exists:', hasTable);
    
    if (!hasTable) {
      // Create bans table if it doesn't exist
      await knex.schema.createTable('bans', (table) => {
        table.increments('id').primary();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.integer('banned_by').references('id').inTable('users');
        table.string('reason').notNullable();
        table.timestamp('expires_at').nullable(); // Changed from banned_until to expires_at
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
      });
      console.log('Created bans table');
    }
    
    const bans = await knex('bans')
      .select(
        'bans.*',
        'users.username as banned_username',
        'users.email as banned_email',
        'admin_users.username as banned_by_username'
      )
      .leftJoin('users', 'bans.user_id', 'users.id')
      .leftJoin('users as admin_users', 'bans.banned_by', 'admin_users.id')
      .where('bans.is_active', true)
      .orderBy('bans.created_at', 'desc');
    
    console.log(`Retrieved ${bans.length} active bans`);
    
    return NextResponse.json({
      success: true,
      data: bans // Changed from 'bans' to 'data' to match frontend expectation
    });
  } catch (error) {
    console.error('Admin bans route error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch bans',
      details: error.message
    }, { status: 500 });
  }
}

async function handleCreateBan(request) {
  try {
    const { user_id, reason, ban_type, expires_at } = await request.json();
    
    console.log('Creating ban:', { user_id, reason, ban_type, expires_at });
    
    // Calculate ban expiration based on ban_type or expires_at
    let banExpiration = null;
    if (expires_at) {
      banExpiration = new Date(expires_at);
    }
    // For permanent bans, banExpiration stays null
    
    // Check if user is already banned
    const existingBan = await knex('bans')
      .where('user_id', user_id)
      .where('is_active', true)
      .first();
    
    if (existingBan) {
      return NextResponse.json({
        success: false,
        error: 'User is already banned'
      }, { status: 400 });
    }
    
    const [ban] = await knex('bans')
      .insert({
        user_id,
        reason,
        expires_at: banExpiration, // Changed from banned_until to expires_at
        banned_by: request.user.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');
    
    // Note: User ban status is tracked in the bans table
    // No need to update users table if it doesn't have banned/status columns
    
    console.log('Ban created successfully:', ban.id);
    
    return NextResponse.json({
      success: true,
      ban
    });
  } catch (error) {
    console.error('Create ban error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create ban',
      details: error.message
    }, { status: 500 });
  }
}

export const GET = requireAdmin(handleGetBans);
export const POST = requireAdmin(handleCreateBan);