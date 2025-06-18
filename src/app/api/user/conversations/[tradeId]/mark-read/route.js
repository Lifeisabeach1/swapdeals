// src/app/api/user/conversations/[tradeId]/mark-read/route.js
import { NextResponse } from 'next/server';
import { knex } from '@/lib/db/index.js';
import jwt from 'jsonwebtoken';

export async function POST(request, { params }) {
  try {
    // Await params before destructuring
    const { tradeId } = await params;

    // Get auth token
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization token required' 
      }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Verify token and get user
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }

    const userId = decoded.id;

    // Mark all unread messages in this trade as read (where the current user is NOT the sender)
    const updatedCount = await knex('trade_messages')
      .where('trade_id', tradeId)
      .where('sender_id', '!=', userId)
      .where('is_deleted', false)
      .whereNull('read_at')
      .update({
        read_at: knex.fn.now()
      });

    return NextResponse.json({
      success: true,
      message: `Marked ${updatedCount} messages as read`,
      updated_count: updatedCount
    });

  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to mark messages as read',
      error: error.message
    }, { status: 500 });
  }
}

// src/app/api/traderoom/[tradeId]/messages/route.js  
export async function GET(request, { params }) {
  try {
    // Await params before destructuring
    const { tradeId } = await params;

    // Get auth token
    const authHeader = request.headers.get('authorization');
    
    // Rest of your code...
  } catch (error) {
    // Error handling
  }
}