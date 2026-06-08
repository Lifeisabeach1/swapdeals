
// ============================================================================
// FILE 2: app/api/auth/forgot-password/route.js
// API endpoint to request password reset
// ============================================================================
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'E-post krävs' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email, username')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    // Don't reveal if user exists or not (security best practice)
    if (userError && userError.code !== 'PGRST116') {
      console.error('Error checking user:', userError);
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    if (user) {
      // Delete old reset codes for this user
      await supabase
        .from('password_resets')
        .delete()
        .eq('user_id', user.id);

      // Store reset code
      const { error: insertError } = await supabase
        .from('password_resets')
        .insert({
          user_id: user.id,
          code,
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error storing reset code:', insertError);
      }

      // TODO: Send email with code
      // For now, log it (in production, use email service like SendGrid, Resend, etc.)
      console.log(`Password reset code for ${email}: ${code}`);
      
      // In development, you could return the code for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('🔑 Reset code:', code);
      }
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'Om e-posten finns kommer du få en återställningskod'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod' },
      { status: 500 }
    );
  }
}
