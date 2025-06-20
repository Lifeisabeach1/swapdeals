// app/api/admin/messages/[id]/route.js
import { NextResponse } from 'next/server';
import knex from '@/lib/db'; // Adjust import path based on your db config location

// GET /api/admin/messages/[id] - Get specific message
export async function GET(request, { params }) {
  try {
    // Optional: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;

    const message = await knex('trade_messages')
      .leftJoin('users as sender', 'trade_messages.sender_id', 'sender.id')
      .leftJoin('trades', 'trade_messages.trade_id', 'trades.id')
      .select(
        'trade_messages.*',
        // Use the correct column names from users table
        'sender.first_name as sender_first_name',
        'sender.last_name as sender_last_name',
        'sender.username as sender_username',
        'sender.email as sender_email',
        // Concatenate first_name and last_name to create a full name
        knex.raw('CONCAT(COALESCE(sender.first_name, \'\'), \' \', COALESCE(sender.last_name, \'\')) as sender_name'),
        // Get trade info if available
        'trades.id as trade_exists'
      )
      .where('trade_messages.id', id)
      .first();

    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Clean up the sender_name field
    const processedMessage = {
      ...message,
      sender_name: message.sender_name ? message.sender_name.trim() : (message.sender_username || 'Unknown User')
    };

    return NextResponse.json({
      success: true,
      message: processedMessage
    });

  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json(
      { error: 'Failed to fetch message' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/messages/[id] - Delete specific message
export async function DELETE(request, { params }) {
  try {
    // Optional: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;

    // Check if message exists
    const existingMessage = await knex('trade_messages')
      .where('id', id)
      .first();

    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Option 1: Soft delete (recommended)
    await knex('trade_messages')
      .where('id', id)
      .update({
        is_deleted: true,
        deleted_at: new Date(),
        updated_at: new Date()
      });

    // Option 2: Hard delete (uncomment if preferred)
    // await knex('trade_messages').where('id', id).del();

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      { error: 'Failed to delete message' },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/messages/[id] - Update message (mark as read, etc.)
export async function PATCH(request, { params }) {
  try {
    // Optional: Add authentication check
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { id } = params;
    const body = await request.json();

    // Check if message exists
    const existingMessage = await knex('trade_messages')
      .where('id', id)
      .first();

    if (!existingMessage) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData = {
      updated_at: new Date()
    };

    // Handle different update operations
    if (body.markAsRead === true) {
      updateData.read_at = new Date();
    } else if (body.markAsRead === false) {
      updateData.read_at = null;
    }

    if (body.content !== undefined) {
      updateData.content = body.content;
      updateData.is_edited = true;
      updateData.edited_at = new Date();
      if (!existingMessage.original_content) {
        updateData.original_content = existingMessage.content;
      }
    }

    if (body.is_flagged !== undefined) {
      updateData.is_flagged = body.is_flagged;
      if (body.is_flagged) {
        updateData.flagged_at = new Date();
        updateData.flag_reason = body.flag_reason || null;
      }
    }

    // Update the message
    const [updatedMessage] = await knex('trade_messages')
      .where('id', id)
      .update(updateData)
      .returning('*');

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully',
      data: updatedMessage
    });

  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json(
      { error: 'Failed to update message' },
      { status: 500 }
    );
  }
}