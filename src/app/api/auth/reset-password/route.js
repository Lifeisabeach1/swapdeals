
// ============================================================================
// FILE 4: app/api/auth/reset-password/route.js
// API endpoint to reset password
// ============================================================================
import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: 'Alla fält krävs' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Lösenordet måste vara minst 6 tecken' },
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
        { error: 'Ogiltig begäran' },
        { status: 400 }
      );
    }

    // Verify code again
    const { data: resetCode } = await supabase
      .from('password_resets')
      .select('*')
      .eq('user_id', user.id)
      .eq('code', code)
      .maybeSingle();

    if (!resetCode || new Date(resetCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Ogiltig eller utgången kod' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hash(newPassword, 12);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Kunde inte återställa lösenord' },
        { status: 500 }
      );
    }

    // Delete used reset code
    await supabase
      .from('password_resets')
      .delete()
      .eq('id', resetCode.id);

    return NextResponse.json({
      success: true,
      message: 'Lösenord återställt'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod' },
      { status: 500 }
    );
  }
}
