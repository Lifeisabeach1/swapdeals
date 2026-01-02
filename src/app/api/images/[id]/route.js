// src/app/api/images/[id]/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get image metadata from database
    const { data: image, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Since we're using Supabase Storage with public URLs,
    // we can just redirect to the public URL or return the metadata
    
    // Option 1: Redirect to the public URL
    return NextResponse.redirect(image.url);

    // Option 2: Return image metadata (uncomment if you prefer this)
    /*
    return NextResponse.json({
      success: true,
      image: {
        id: image.id,
        filename: image.filename,
        url: image.url,
        originalName: image.original_name,
        rotation: image.rotation || 0,
        width: image.processed_width || image.original_width,
        height: image.processed_height || image.original_height,
        mimeType: image.mime_type,
        fileSize: image.file_size,
        createdAt: image.created_at
      }
    });
    */

  } catch (error) {
    console.error('Image fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}