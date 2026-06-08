
// ============================================
// app/api/auth/login/route.js
// ============================================
import { NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-post och lösenord krävs' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, username, email, password, role, is_active')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: 'Felaktig e-post eller lösenord' },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Kontot är inaktiverat' },
        { status: 403 }
      );
    }

    // Verify password
    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: 'Felaktig e-post eller lösenord' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod' },
      { status: 500 }
    );
  }
}

