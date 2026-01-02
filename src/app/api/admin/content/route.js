import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { withAdmin } from '@/lib/middleware/auth';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get all content (Admin only)
 * @route GET /api/admin/content
 */
async function getContent(request) {
  try {
    console.log('=== ADMIN CONTENT ROUTE ===');
    console.log('Authenticated user:', request.user.username);

    // Get all trade listings with user information
    const { data: trades, error } = await supabase
      .from('trades')
      .select(`
        *,
        seller:users!trades_seller_id_fkey(username, email),
        buyer:users!trades_buyer_id_fkey(username, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching trades:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch content',
        details: error.message
      }, { status: 500 });
    }

    console.log(`Retrieved ${trades.length} trade listings`);

    // Format the data to match frontend expectations
    const formattedTrades = trades.map(trade => ({
      ...trade,
      type: 'trade', // Add type for consistency
      description: trade.description || trade.title || 'No description',
      seller_username: trade.seller?.username || null,
      seller_email: trade.seller?.email || null,
      buyer_username: trade.buyer?.username || null,
      buyer_email: trade.buyer?.email || null
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

    let deleteResult;

    // Delete based on content type
    switch (contentType) {
      case 'trade':
      default:
        // Delete from trades table
        deleteResult = await supabase
          .from('trades')
          .delete()
          .eq('id', contentId)
          .select();
        break;
      
      // Add other content types as needed
      // case 'message':
      //   deleteResult = await supabase
      //     .from('messages')
      //     .delete()
      //     .eq('id', contentId)
      //     .select();
      //   break;
    }

    if (deleteResult.error) {
      console.error('Error deleting content:', deleteResult.error);
      return NextResponse.json({
        success: false,
        error: 'Failed to delete content',
        details: deleteResult.error.message
      }, { status: 500 });
    }

    if (!deleteResult.data || deleteResult.data.length === 0) {
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

export const GET = withAdmin(getContent);
export const DELETE = withAdmin(deleteContent);