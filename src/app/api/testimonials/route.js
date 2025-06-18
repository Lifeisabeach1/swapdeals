// app/api/testimonials/route.js - Main testimonials routes
import { knex } from '@/lib/db/index.js';
import { NextResponse } from 'next/server';

// GET all testimonials
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const includeInactive = searchParams.get('include_inactive') === 'true';

    let query = knex('testimonials')
      .select([
        'id',
        'name',
        'location',
        'text',
        'avatar',
        'rating',
        'bg_color as bgColor',
        'is_verified as isVerified',
        'created_at as createdAt'
      ])
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    if (!includeInactive) {
      query = query.where('is_active', true);
    }

    const testimonials = await query;

    // Get total count for pagination
    const totalQuery = knex('testimonials').count('* as count');
    if (!includeInactive) {
      totalQuery.where('is_active', true);
    }
    const [{ count }] = await totalQuery;

    return NextResponse.json({
      testimonials,
      pagination: {
        total: parseInt(count),
        limit,
        offset,
        hasMore: offset + limit < parseInt(count)
      }
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST new testimonial
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, location, text, avatar, rating, bgColor } = body;

    // Validation
    if (!name || !location || !text || !avatar || !rating || !bgColor) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim().substring(0, 100),
      location: location.trim().substring(0, 100),
      text: text.trim().substring(0, 1000),
      avatar: avatar.trim(),
      rating: parseInt(rating),
      bg_color: bgColor.trim(),
      is_verified: false, // New testimonials start unverified
      is_active: true
    };

    // Insert into database
    const [newTestimonial] = await knex('testimonials')
      .insert(sanitizedData)
      .returning([
        'id',
        'name',
        'location',
        'text',
        'avatar',
        'rating',
        'bg_color as bgColor',
        'is_verified as isVerified',
        'created_at as createdAt'
      ]);

    return NextResponse.json({
      message: 'Testimonial created successfully',
      testimonial: newTestimonial
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}