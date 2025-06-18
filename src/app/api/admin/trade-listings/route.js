// src/app/api/admin/trade-listings/route.js
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { knex } from '@/lib/db/index.js';

// GET handler wrapped with admin middleware
export const GET = requireAdmin(async (request) => {
  try {
    console.log('=== TRADE LISTINGS API START ===');
    console.log('Admin user:', request.user.username);

    // First, let's check what columns actually exist
    const columnInfo = await knex('trade_listings').columnInfo();
    console.log('Available columns in trade_listings:', Object.keys(columnInfo));

    // Let's also check if there are any records at all
    const totalCount = await knex('trade_listings').count('* as count').first();
    console.log('Total records in trade_listings:', totalCount.count);

    // Try a simple query first to see what we get
    const simpleQuery = await knex('trade_listings').select('*').limit(5);
    console.log('Sample records:', simpleQuery);

    // Now try the full query with only columns that definitely exist
    // Start with basic columns that should exist from your first migration
    const tradeListings = await knex('trade_listings as tl')
      .leftJoin('users as u', 'tl.user_id', 'u.id')
      .select(
        'tl.id',
        'tl.user_id',
        'tl.title',
        'tl.description',
        'tl.location',
        'tl.status',
        'tl.created_at',
        'tl.updated_at',
        'u.username',
        'u.email'
      )
      .orderBy('tl.created_at', 'desc');

    console.log(`Found ${tradeListings.length} trade listings`);
    console.log('Trade listings data:', tradeListings);

    return NextResponse.json({
      success: true,
      data: tradeListings,
      count: tradeListings.length,
      debug: {
        availableColumns: Object.keys(columnInfo),
        totalRecords: totalCount.count,
        sampleData: simpleQuery
      }
    });

  } catch (error) {
    console.error('Trade listings API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch trade listings',
      debug: {
        errorMessage: error.message,
        errorCode: error.code,
        errorDetail: error.detail
      }
    }, { 
      status: error.statusCode || 500 
    });
  }
});

// DELETE handler for deleting trade listings
export const DELETE = requireAdmin(async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('id');

    if (!listingId) {
      return NextResponse.json({
        success: false,
        error: 'Listing ID is required'
      }, { status: 400 });
    }

    console.log('Deleting trade listing:', listingId);

    // Check if listing exists
    const listing = await knex('trade_listings')
      .where('id', listingId)
      .first();

    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Trade listing not found'
      }, { status: 404 });
    }

    // Delete the listing
    await knex('trade_listings')
      .where('id', listingId)
      .del();

    console.log('Trade listing deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Trade listing deleted successfully'
    });

  } catch (error) {
    console.error('Delete trade listing error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to delete trade listing'
    }, { 
      status: 500 
    });
  }
});

// PUT handler for updating trade listing status
export const PUT = requireAdmin(async (request) => {
  try {
    const { listingId, status } = await request.json();

    if (!listingId || !status) {
      return NextResponse.json({
        success: false,
        error: 'Listing ID and status are required'
      }, { status: 400 });
    }

    console.log('Updating trade listing:', listingId, 'to status:', status);

    // Check if listing exists
    const listing = await knex('trade_listings')
      .where('id', listingId)
      .first();

    if (!listing) {
      return NextResponse.json({
        success: false,
        error: 'Trade listing not found'
      }, { status: 404 });
    }

    // Update the listing status
    await knex('trade_listings')
      .where('id', listingId)
      .update({
        status: status,
        updated_at: new Date()
      });

    console.log('Trade listing status updated successfully');

    return NextResponse.json({
      success: true,
      message: 'Trade listing status updated successfully'
    });

  } catch (error) {
    console.error('Update trade listing error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to update trade listing'
    }, { 
      status: 500 
    });
  }
});