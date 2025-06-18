// src/app/api/admin/trade-listings/[id]/status/route.js
import { knex } from '@/lib/db';


export async function PATCH(request, { params }) {
  try {
    // Verify admin authentication
    const user = await verifyAdminToken(request);
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id || isNaN(parseInt(id))) {
      return Response.json({ error: 'Invalid listing ID' }, { status: 400 });
    }

    const listingId = parseInt(id);
    const { status } = await request.json();

    if (!status) {
      return Response.json({ error: 'Status is required' }, { status: 400 });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if listing exists
    const existingListing = await knex('trade_listings')
      .select('id', 'user_id', 'status as current_status')
      .where('id', listingId)
      .first();

    if (!existingListing) {
      return Response.json({ error: 'Trade listing not found' }, { status: 404 });
    }

    // Update the status
    await knex('trade_listings')
      .where('id', listingId)
      .update({
        status,
        updated_at: knex.fn.now()
      });

    // Log the admin action
    await knex('admin_actions').insert({
      admin_id: user.id,
      action_type: 'status_update',
      target_type: 'trade_listing',
      target_id: listingId,
      details: JSON.stringify({
        old_status: existingListing.current_status,
        new_status: status
      }),
      created_at: knex.fn.now()
    });

    return Response.json({
      success: true,
      message: 'Trade listing status updated successfully'
    });

  } catch (error) {
    console.error('Trade listing status API error:', error);
    return Response.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}