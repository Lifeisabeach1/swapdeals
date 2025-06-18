// 4. Updated content management route with delete functionality - app/api/admin/content/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import { requireAdmin } from '@/lib/middleware/auth';

/**
 * Get all content (Admin only)
 * @route GET /api/admin/content
 */
async function getContent(request) {
  try {
    console.log('=== ADMIN CONTENT ROUTE ===');
    console.log('Authenticated user:', request.user.username);

    // Get all trade listings with user information
    const trades = await knex('trades')
      .select(
        'trades.*',
        'seller.username as seller_username',
        'seller.email as seller_email',
        'buyer.username as buyer_username',
        'buyer.email as buyer_email'
      )
      .leftJoin('users as seller', 'trades.seller_id', 'seller.id')
      .leftJoin('users as buyer', 'trades.buyer_id', 'buyer.id')
      .orderBy('trades.created_at', 'desc');

    console.log(`Retrieved ${trades.length} trade listings`);

    // Format the data to match frontend expectations
    const formattedTrades = trades.map(trade => ({
      ...trade,
      type: 'trade', // Add type for consistency
      description: trade.description || trade.title || 'No description',
    }));

    return NextResponse.json({
      success: true,
      content: formattedTrades,
      data: formattedTrades // Include both for compatibility
    });

  } catch (error) {
    console.error('Admin content route error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch content',
      details: error.message
    }, { status: 500 });
  }
}

/**
 * Delete content (Admin only)
 * @route DELETE /api/admin/content
 */
async function deleteContent(request) {
  try {
    const { contentId, contentType } = await request.json();
    
    console.log('Deleting content:', { contentId, contentType });

    if (!contentId) {
      return NextResponse.json({
        success: false,
        error: 'Content ID is required'
      }, { status: 400 });
    }

    let deletedRows = 0;

    // Delete based on content type
    switch (contentType) {
      case 'trade':
      default:
        // Delete from trades table
        deletedRows = await knex('trades')
          .where('id', contentId)
          .del();
        break;
      
      // Add other content types as needed
      // case 'message':
      //   deletedRows = await knex('messages').where('id', contentId).del();
      //   break;
    }

    if (deletedRows === 0) {
      return NextResponse.json({
        success: false,
        error: 'Content not found or already deleted'
      }, { status: 404 });
    }

    console.log('Content deleted successfully:', contentId);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error) {
    console.error('Delete content error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete content',
      details: error.message
    }, { status: 500 });
  }
}

export const GET = requireAdmin(getContent);
export const DELETE = requireAdmin(deleteContent);