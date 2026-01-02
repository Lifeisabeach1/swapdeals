
// ============================================
// app/api/testimonials/[id]/route.js
// ============================================

// GET - Single testimonial
export async function GET_SINGLE(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from('testimonials')
      .select('id, name, location, text, avatar, rating, bg_color, is_verified, is_active, created_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      testimonial: {
        id: data.id,
        name: data.name,
        location: data.location,
        text: data.text,
        avatar: data.avatar,
        rating: data.rating,
        bgColor: data.bg_color,
        isVerified: data.is_verified,
        isActive: data.is_active,
        createdAt: data.created_at
      }
    });

  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonial' }, { status: 500 });
  }
}

// PATCH - Update testimonial
export async function PATCH_SINGLE(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isVerified, isActive } = body;

    const updateData = { updated_at: new Date().toISOString() };
    if (typeof isVerified !== 'undefined') updateData.is_verified = isVerified;
    if (typeof isActive !== 'undefined') updateData.is_active = isActive;

    const { data, error } = await supabase
      .from('testimonials')
      .update(updateData)
      .eq('id', id)
      .select('id, name, location, text, avatar, rating, bg_color, is_verified, is_active, updated_at')
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Testimonial updated',
      testimonial: {
        id: data.id,
        name: data.name,
        location: data.location,
        text: data.text,
        avatar: data.avatar,
        rating: data.rating,
        bgColor: data.bg_color,
        isVerified: data.is_verified,
        isActive: data.is_active,
        updatedAt: data.updated_at
      }
    });

  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

// DELETE - Delete testimonial
export async function DELETE_SINGLE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Testimonial deleted' });

  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}