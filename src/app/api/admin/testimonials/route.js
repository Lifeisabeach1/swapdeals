// src/app/api/admin/testimonials/route.js
import { knex } from '@/lib/db/index.js';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

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

    const testimonials = await knex('testimonials')
      .select([
        'id',
        'name',
        'location',
        'text',
        'avatar',
        'rating',
        'bg_color as bgColor',
        'is_verified as isVerified',
        'is_active as isActive',
        'created_at as createdAt',
        'updated_at as updatedAt'
      ])
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count }] = await knex('testimonials').count('* as count');

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
    const existingTestimonial = await knex('testimonials')
      .where('id', testimonialId)
      .first();

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Delete the testimonial
    const deleted = await knex('testimonials')
      .where('id', testimonialId)
      .del();

    if (!deleted) {
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
    updateData.updated_at = new Date();

    const [updatedTestimonial] = await knex('testimonials')
      .where('id', testimonialId)
      .update(updateData)
      .returning([
        'id',
        'name',
        'location',
        'text',
        'avatar',
        'rating',
        'bg_color as bgColor',
        'is_verified as isVerified',
        'is_active as isActive',
        'updated_at as updatedAt'
      ]);

    if (!updatedTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Testimonial updated successfully',
      testimonial: updatedTestimonial
    });

  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}