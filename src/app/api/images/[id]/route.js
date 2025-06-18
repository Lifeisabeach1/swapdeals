// app/api/images/[id]/route.js
import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { knex } from '@/lib/db/index.js';

export async function GET(request, { params }) {
  try {
    const { id } = params;

    // Get image metadata from database
    const image = await knex('images')
      .select('*')
      .where({ id })
      .first();

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Read actual image file from filesystem
    const filePath = path.join(process.cwd(), 'public', image.file_path);
    const imageBuffer = await readFile(filePath);

    // Return the image binary data
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': image.mime_type,
        'Content-Length': image.file_size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('Image fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image' },
      { status: 500 }
    );
  }
}