// src/app/api/cookie-consent/route.js
import { NextResponse } from 'next/server';
import knex from '@/lib/db'; // Adjust path to your knex instance

export async function POST(request) {
  try {
    const body = await request.json();
    const { consent, settings, timestamp, userAgent } = body; // Added settings here
    
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(/, /)[0] : request.headers.get('x-real-ip') || 'unknown';
    
    // Insert consent record into database
    await knex('cookie_consents').insert({
      consent_type: consent, // 'accepted', 'declined', or 'custom'
      cookie_settings: settings, // Store settings as JSON object (knex handles JSON automatically)
      ip_address: ip,
      user_agent: userAgent,
      consent_date: timestamp,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now()
    });

    return NextResponse.json({
      success: true,
      message: 'Consent recorded successfully'
    });
  } catch (error) {
    console.error('Error recording cookie consent:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to record consent' },
      { status: 500 }
    );
  }
}