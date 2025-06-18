
// app/api/notifications/count/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = decoded; // or extract user info as needed
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const count = await NotificationService.getUnreadCount(user.id);

    return NextResponse.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    console.error('Error fetching notification count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification count' },
      { status: 500 }
    );
  }
}