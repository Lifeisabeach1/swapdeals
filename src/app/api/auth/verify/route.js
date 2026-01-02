// ============================================
// app/api/auth/verify/route.js
// ============================================
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token krävs' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: 'Ogiltig eller utgången token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod' },
      { status: 500 }
    );
  }
}