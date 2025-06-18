// src/app/api/admin/trade-listings/[id]/route.js
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { knex } from '@/lib/db/index.js';

export const GET = requireAdmin(async (request, { params }) => {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
    }

    const listingId = parseInt(id);

    // Get specific trade listing
    const listing = await knex('trade_listings as tl')
      .leftJoin('users as u', 'tl.user_id', 'u.id')
      .leftJoin('trade_listing_views as tlv', 'tl.id', 'tlv.listing_id')
      .select([
        'tl.*',
        'u.username as user_name',
        'u.email as user_email',
        'u.name as user_full_name',
        knex.raw('COUNT(tlv.id) as views')
      ])
      .where('tl.id', listingId)
      .groupBy(['tl.id', 'u.id'])
      .first();

    if (!listing) {
      return NextResponse.json({ error: 'Trade listing not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      listing
    });

  } catch (error) {
    console.error('Trade listing API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
});

export const PUT = requireAdmin(async (request, { params }) => {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
    }

    const listingId = parseInt(id);
    const { title, description, category, location, status } = await request.json();

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if listing exists
    const existingListing = await knex('trade_listings')
      .select('id', 'user_id')
      .where('id', listingId)
      .first();

    if (!existingListing) {
      return NextResponse.json({ error: 'Trade listing not found' }, { status: 404 });
    }

    // Update the listing
    await knex('trade_listings')
      .where('id', listingId)
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        category: category?.trim() || null,
        location: location?.trim() || null,
        status: status || 'active',
        updated_at: knex.fn.now()
      });

    // Log the admin action (only if admin_actions table exists)
    try {
      await knex('admin_actions').insert({
        admin_id: request.user.id,
        action_type: 'update',
        target_type: 'trade_listing',
        target_id: listingId,
        details: JSON.stringify({
          title: title.trim(),
          description: description?.trim(),
          category: category?.trim(),
          location: location?.trim(),
          status: status || 'active'
        }),
        created_at: knex.fn.now()
      });
    } catch (logError) {
      console.warn('Could not log admin action:', logError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Trade listing updated successfully'
    });

  } catch (error) {
    console.error('Trade listing API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
});

export const DELETE = requireAdmin(async (request, { params }) => {
  try {
    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ error: 'Invalid listing ID' }, { status: 400 });
    }

    const listingId = parseInt(id);

    // Check if listing exists
    const existingListing = await knex('trade_listings')
      .select('id', 'user_id')
      .where('id', listingId)
      .first();

    if (!existingListing) {
      return NextResponse.json({ error: 'Trade listing not found' }, { status: 404 });
    }

    // Check which related tables exist before starting transaction
    const tableChecks = await Promise.allSettled([
      knex.raw("SELECT to_regclass('trade_inquiries')").then(result => ({ 
        table: 'trade_inquiries', 
        exists: result.rows[0].to_regclass !== null 
      })),
      knex.raw("SELECT to_regclass('trade_favorites')").then(result => ({ 
        table: 'trade_favorites', 
        exists: result.rows[0].to_regclass !== null 
      })),
      knex.raw("SELECT to_regclass('admin_actions')").then(result => ({ 
        table: 'admin_actions', 
        exists: result.rows[0].to_regclass !== null 
      }))
    ]);

    const existingTables = tableChecks
      .filter(check => check.status === 'fulfilled')
      .map(check => check.value)
      .filter(table => table.exists)
      .map(table => table.table);

    console.log('Existing related tables:', existingTables);

    // Use transaction to ensure data integrity
    await knex.transaction(async (trx) => {
      // Delete related records first (only for tables that exist)
      if (existingTables.includes('trade_inquiries')) {
        await trx('trade_inquiries').where('listing_id', listingId).del();
        console.log('Deleted from trade_inquiries');
      }
      
      if (existingTables.includes('trade_favorites')) {
        await trx('trade_favorites').where('listing_id', listingId).del();
        console.log('Deleted from trade_favorites');
      }
      
      // Delete the listing
      await trx('trade_listings').where('id', listingId).del();
      console.log('Deleted trade listing');

      // Log the admin action (only if admin_actions table exists)
      if (existingTables.includes('admin_actions')) {
        await trx('admin_actions').insert({
          admin_id: request.user.id,
          action_type: 'delete',
          target_type: 'trade_listing',
          target_id: listingId,
          details: JSON.stringify({ deleted_by_admin: true }),
          created_at: knex.fn.now()
        });
        console.log('Logged admin action');
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Trade listing deleted successfully'
    });

  } catch (error) {
    console.error('Trade listing API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
});