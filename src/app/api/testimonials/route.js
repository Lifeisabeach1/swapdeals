// app/api/testimonials/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET - Public testimonials
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const includeInactive = searchParams.get('include_inactive') === 'true';

    let query = supabase
      .from('testimonials')
      .select('id, name, location, text, avatar, rating, bg_color, is_verified, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (!includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data: testimonials, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
    }

    // Get count
    let countQuery = supabase.from('testimonials').select('*', { count: 'exact', head: true });
    if (!includeInactive) countQuery = countQuery.eq('is_active', true);
    const { count } = await countQuery;

    // Transform to camelCase
    const transformed = testimonials.map(t => ({
      id: t.id,
      name: t.name,
      location: t.location,
      text: t.text,
      avatar: t.avatar,
      rating: t.rating,
      bgColor: t.bg_color,
      isVerified: t.is_verified,
      createdAt: t.created_at
    }));

    return NextResponse.json({
      testimonials: transformed,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: offset + limit < (count || 0)
      }
    });

  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

// POST - Create testimonial
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, location, text, avatar, rating, bgColor } = body;

    if (!name || !location || !text || !avatar || !rating || !bgColor) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        name: name.trim().substring(0, 100),
        location: location.trim().substring(0, 100),
        text: text.trim().substring(0, 1000),
        avatar: avatar.trim(),
        rating: parseInt(rating),
        bg_color: bgColor.trim(),
        is_verified: false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('id, name, location, text, avatar, rating, bg_color, is_verified, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Testimonial created',
      testimonial: {
        id: data.id,
        name: data.name,
        location: data.location,
        text: data.text,
        avatar: data.avatar,
        rating: data.rating,
        bgColor: data.bg_color,
        isVerified: data.is_verified,
        createdAt: data.created_at
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
