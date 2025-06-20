// ==================
// app/api/testimonials/[id]/route.js - Individual testimonial routes

// GET single testimonial
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const testimonial = await knex('testimonials')
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
        'created_at as createdAt'
      ])
      .where('id', id)
      .first();

    if (!testimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial });

  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// UPDATE testimonial (for admin use)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { isVerified, isActive } = body;

    const updateData = {};
    if (typeof isVerified !== 'undefined') {
      updateData.is_verified = isVerified;
    }
    if (typeof isActive !== 'undefined') {
      updateData.is_active = isActive;
    }
    updateData.updated_at = new Date();

    const [updatedTestimonial] = await knex('testimonials')
      .where('id', id)
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

// DELETE testimonial
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const deleted = await knex('testimonials')
      .where('id', id)
      .del();

    if (!deleted) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Testimonial deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}