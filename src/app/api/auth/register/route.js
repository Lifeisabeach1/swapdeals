// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { supabase } from '@/lib/supabase'; // ← Use centralized client
import { generateToken } from '@/lib/auth/jwt';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Alla fält krävs' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Användarnamn måste vara minst 3 tecken' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Lösenordet måste vara minst 6 tecken' },
        { status: 400 }
      );
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Ogiltig e-postadress' },
        { status: 400 }
      );
    }

    // Check if email exists (fixed)
    const { data: existingEmail, error: emailCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .maybeSingle(); // ← Use maybeSingle() instead of single()

    if (emailCheckError) {
      console.error('Email check error:', emailCheckError);
      return NextResponse.json(
        { error: 'Kunde inte kontrollera e-post' },
        { status: 500 }
      );
    }

    if (existingEmail) {
      return NextResponse.json(
        { error: 'E-postadressen är redan registrerad' },
        { status: 409 }
      );
    }

    // Check if username exists (optional but recommended)
    const { data: existingUsername } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Användarnamnet är redan taget' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const { data: user, error: createError } = await supabase
      .from('users')
      .insert({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'user',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, username, email, role')
      .single();

    if (createError) {
      console.error('Create user error:', createError);
      
      // Handle unique constraint violations
      if (createError.code === '23505') {
        return NextResponse.json(
          { error: 'E-post eller användarnamn finns redan' },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: 'Kunde inte skapa användare' },
        { status: 500 }
      );
    }

    // Generate token (optional - if you want auto-login after registration)
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      token, // Include token for auto-login
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Ett oväntat fel uppstod' },
      { status: 500 }
    );
  }
}