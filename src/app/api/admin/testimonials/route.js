// src/app/api/admin/testimonials/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Helper function to verify admin authentication
function verifyAdminAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No token provided', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'admin') {
      return { error: 'Admin access required', status: 403 };
    }

    return { user: decoded };
  } catch (error) {
    return { error: 'Invalid token', status: 401 };
  }
}

// GET all testimonials (admin view - includes inactive)
export async function GET(request) {
  const authResult = verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Get testimonials with pagination
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select(`
        id,
        name,
        location,
        text,
        avatar,
        rating,
        bg_color,
        is_verified,
        is_active,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (testimonialsError) {
      console.error('Error fetching testimonials:', testimonialsError);
      return NextResponse.json(
        { error: 'Failed to fetch testimonials' },
        { status: 500 }
      );
    }

    // Get total count
    const { count: total, error: countError } = await supabase
      .from('testimonials')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting testimonials count:', countError);
      return NextResponse.json(
        { error: 'Failed to get testimonials count' },
        { status: 500 }
      );
    }

    // Transform data to match expected format (camelCase)
    const transformedTestimonials = testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      location: testimonial.location,
      text: testimonial.text,
      avatar: testimonial.avatar,
      rating: testimonial.rating,
      bgColor: testimonial.bg_color,
      isVerified: testimonial.is_verified,
      isActive: testimonial.is_active,
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at
    }));

    return NextResponse.json({
      testimonials: transformedTestimonials,
      pagination: {
        total: total || 0,
        limit,
        offset,
        hasMore: offset + limit < (total || 0)
      }
    });

  } catch (error) {
    console.error('Error fetching testimonials for admin:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// DELETE testimonial (admin only)
export async function DELETE(request) {
  const authResult = verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const { testimonialId } = body;

    if (!testimonialId) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    // Check if testimonial exists
    const { data: existingTestimonial, error: fetchError } = await supabase
      .from('testimonials')
      .select('id')
      .eq('id', testimonialId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error checking testimonial existence:', fetchError);
      return NextResponse.json(
        { error: 'Failed to check testimonial' },
        { status: 500 }
      );
    }

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Delete the testimonial
    const { error: deleteError } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', testimonialId);

    if (deleteError) {
      console.error('Error deleting testimonial:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete testimonial' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Testimonial deleted successfully',
      deletedId: testimonialId
    });

  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}

// PATCH testimonial (admin only - for updating verification/active status)
export async function PATCH(request) {
  const authResult = verifyAdminAuth(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status }
    );
  }

  try {
    const body = await request.json();
    const { testimonialId, isVerified, isActive } = body;

    if (!testimonialId) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    const updateData = {};
    if (typeof isVerified !== 'undefined') {
      updateData.is_verified = isVerified;
    }
    if (typeof isActive !== 'undefined') {
      updateData.is_active = isActive;
    }
    updateData.updated_at = new Date().toISOString();

    const { data: updatedTestimonial, error: updateError } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', testimonialId)
      .select(`
        id,
        name,
        location,
        text,
        avatar,
        rating,
        bg_color,
        is_verified,
        is_active,
        updated_at
      `)
      .single();

    if (updateError) {
      console.error('Error updating testimonial:', updateError);
      if (updateError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Testimonial not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to update testimonial' },
        { status: 500 }
      );
    }

    // Transform data to match expected format (camelCase)
    const transformedTestimonial = {
      id: updatedTestimonial.id,
      name: updatedTestimonial.name,
      location: updatedTestimonial.location,
      text: updatedTestimonial.text,
      avatar: updatedTestimonial.avatar,
      rating: updatedTestimonial.rating,
      bgColor: updatedTestimonial.bg_color,
      isVerified: updatedTestimonial.is_verified,
      isActive: updatedTestimonial.is_active,
      updatedAt: updatedTestimonial.updated_at
    };

    return NextResponse.json({
      message: 'Testimonial updated successfully',
      testimonial: transformedTestimonial
    });

  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}