
// ============================================================================
// FILE 3: app/api/auth/verify-reset-code/route.js
// API endpoint to verify reset code
// ============================================================================
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'E-post och kod krävs' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (!user) {
      return NextResponse.json(
        { error: 'Ogiltig kod' },
        { status: 400 }
      );
    }

    // Check reset code
    const { data: resetCode } = await supabase
      .from('password_resets')
      .select('*')
      .eq('user_id', user.id)
      .eq('code', code)
      .maybeSingle();

    if (!resetCode) {
      return NextResponse.json(
        { error: 'Ogiltig kod' },
        { status: 400 }
      );
    }

    // Check if expired
    if (new Date(resetCode.expires_at) < new Date()) {
      // Delete expired code
      await supabase
        .from('password_resets')
        .delete()
        .eq('id', resetCode.id);

      return NextResponse.json(
        { error: 'Koden har gått ut. Begär en ny kod.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kod verifierad'
    });

  } catch (error) {
    console.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod' },
      { status: 500 }
    );
  }
}
