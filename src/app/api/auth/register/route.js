// app/api/auth/register/route.js (App Router)

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Initialize Supabase with service role key for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// For App Router (app/api/auth/register/route.js)
export async function POST(request) {
  try {
    const { email, password, username } = await request.json()

    // Validate input
    if (!email || !password || !username) {
      return Response.json(
        { error: 'Email, password, and username are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return Response.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        email: email,
        username: username,
        password: hashedPassword,
        created_at: new Date().toISOString()
        // Don't include 'id' - let the database auto-generate it
      }])
      .select()
      .single()

    if (userError) {
      console.error('User creation error:', userError)
      return Response.json(
        { error: 'Failed to create user: ' + userError.message },
        { status: 500 }
      )
    }

    // Update platform stats
    try {
      await updatePlatformStats()
    } catch (statsError) {
      console.error('Platform stats update failed:', statsError)
      // Don't fail registration if stats update fails
    }

    // Return success (don't include password in response)
    const { password: _, ...userResponse } = userData

    return Response.json({
      message: 'User registered successfully',
      user: userResponse
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', error)
    return Response.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    )
  }
}

// For Pages Router (pages/api/auth/register.js)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, username } = req.body

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'Email, password, and username are required' })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email, username')
      .or(`email.eq.${email},username.eq.${username}`)
      .single()

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or username already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user in database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        email: email,
        username: username,
        password: hashedPassword,
        created_at: new Date().toISOString()
        // Don't include 'id' - let the database auto-generate it
      }])
      .select()
      .single()

    if (userError) {
      console.error('User creation error:', userError)
      return res.status(500).json({ error: 'Failed to create user: ' + userError.message })
    }

    // Update platform stats
    try {
      await updatePlatformStats()
    } catch (statsError) {
      console.error('Platform stats update failed:', statsError)
      // Don't fail registration if stats update fails
    }

    // Return success (don't include password in response)
    const { password: _, ...userResponse } = userData

    return res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    })

  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ error: 'Internal server error: ' + error.message })
  }
}

// Helper function to update platform stats
async function updatePlatformStats() {
  // Get current stats
  const { data: currentStats, error: fetchError } = await supabase
    .from('platform_stats')
    .select('*')
    .single()

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
    throw new Error('Failed to fetch platform stats: ' + fetchError.message)
  }

  if (currentStats) {
    // Update existing stats
    const { error: updateError } = await supabase
      .from('platform_stats')
      .update({
        total_users: currentStats.total_users + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentStats.id)

    if (updateError) {
      throw new Error('Failed to update platform stats: ' + updateError.message)
    }
  } else {
    // Create initial stats record
    const { error: insertError } = await supabase
      .from('platform_stats')
      .insert([{
        total_users: 1,
        total_listings: 0,
        total_trades: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (insertError) {
      throw new Error('Failed to create platform stats: ' + insertError.message)
    }
  }
}

// Test function to verify the fix
export async function testRegistration() {
  const testData = {
    email: 'test@example.com',
    password: 'testpassword123',
    username: 'testuser'
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()
    console.log('Registration test result:', result)
    return result
  } catch (error) {
    console.error('Registration test failed:', error)
    return { error: error.message }
  }
}