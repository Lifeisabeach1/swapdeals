// app/api/admin/testimonials/route.js - Admin testimonials management
import { knex } from '@/lib/db/index.js';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Middleware to verify admin authentication
async function verifyAdmin(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'No valid authorization header' };
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user exists and is admin
    const user = await knex('users')
      .select('id', 'username', 'role')
      .where({ id: decoded.userId })
      .first();

    if (!user || user.role !== 'admin') {
      return { error: 'Admin access required' };
    }

    return { user };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { error: 'Invalid token' };
  }
}

// GET all testimonials (admin view with full details)
export async function GET(request) {
  try {
    // Verify admin authentication
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const status = searchParams.get('status'); // 'verified', 'unverified', 'active', 'inactive'

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
        'is_active as isActive',
        'created_at as createdAt',
        'updated_at as updatedAt'
      ])
      .orderBy('created_at', 'desc');

    // Apply status filters
    if (status === 'verified') {
      query = query.where('is_verified', true);
    } else if (status === 'unverified') {
      query = query.where('is_verified', false);
    } else if (status === 'active') {
      query = query.where('is_active', true);
    } else if (status === 'inactive') {
      query = query.where('is_active', false);
    }

    // Apply pagination
    const testimonials = await query.limit(limit).offset(offset);

    // Get total count for pagination
    let countQuery = knex('testimonials').count('* as count');
    if (status === 'verified') {
      countQuery = countQuery.where('is_verified', true);
    } else if (status === 'unverified') {
      countQuery = countQuery.where('is_verified', false);
    } else if (status === 'active') {
      countQuery = countQuery.where('is_active', true);
    } else if (status === 'inactive') {
      countQuery = countQuery.where('is_active', false);
    }

    const [{ count }] = await countQuery;

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

// PATCH update testimonial (verify/unverify, activate/deactivate)
export async function PATCH(request) {
  try {
    // Verify admin authentication
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { testimonialId, isVerified, isActive } = body;

    if (!testimonialId) {
      return NextResponse.json(
        { error: 'Testimonial ID is required' },
        { status: 400 }
      );
    }

    // Check if testimonial exists
    const existingTestimonial = await knex('testimonials')
      .select('id')
      .where({ id: testimonialId })
      .first();

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Build update object
    const updateData = {
      updated_at: knex.fn.now()
    };

    if (typeof isVerified === 'boolean') {
      updateData.is_verified = isVerified;
    }

    if (typeof isActive === 'boolean') {
      updateData.is_active = isActive;
    }

    // Update testimonial
    await knex('testimonials')
      .where({ id: testimonialId })
      .update(updateData);

    // Get updated testimonial
    const updatedTestimonial = await knex('testimonials')
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
      .where({ id: testimonialId })
      .first();

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

// DELETE testimonial
export async function DELETE(request) {
  try {
    // Verify admin authentication
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

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
      .select('id', 'name')
      .where({ id: testimonialId })
      .first();

    if (!existingTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Delete testimonial
    await knex('testimonials')
      .where({ id: testimonialId })
      .del();

    return NextResponse.json({
      message: 'Testimonial deleted successfully',
      deletedTestimonial: {
        id: testimonialId,
        name: existingTestimonial.name
      }
    });

  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}