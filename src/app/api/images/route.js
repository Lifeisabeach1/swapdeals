// src/app/api/images/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { knex } from '@/lib/db/index.js';
import { supabase } from '@/lib/supabase.js';
import sharp from 'sharp';
import path from 'path';

// Add OPTIONS handler for CORS
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  try {
    // Add error handling for missing environment variables
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error' 
      }, { status: 500 });
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables are not set');
      return NextResponse.json({ 
        success: false, 
        message: 'Server configuration error' 
      }, { status: 500 });
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid token payload' 
      }, { status: 401 });
    }

    // Parse form data with error handling
    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      console.error('FormData parsing error:', formError);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid form data' 
      }, { status: 400 });
    }

    const files = formData.getAll('images');
    const rotations = formData.getAll('rotations');

    if (!files || files.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'No files uploaded' 
      }, { status: 400 });
    }

    // Limit to 2 images for your use case
    if (files.length > 2) {
      return NextResponse.json({ 
        success: false, 
        message: 'Maximum 2 images allowed' 
      }, { status: 400 });
    }

    const uploadedImages = [];
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.size) continue;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          success: false, 
          message: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP allowed.` 
        }, { status: 400 });
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return NextResponse.json({ 
          success: false, 
          message: `File too large: ${file.name}. Maximum 10MB allowed.` 
        }, { status: 400 });
      }

      // Get rotation value for this image (default to 0)
      const rotation = parseInt(rotations[i]) || 0;
      const validRotations = [0, 90, 180, 270];
      if (!validRotations.includes(rotation)) {
        return NextResponse.json({ 
          success: false, 
          message: `Invalid rotation value: ${rotation}. Must be 0, 90, 180, or 270.` 
        }, { status: 400 });
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.name) || '.jpg';
      const filename = `${userId}/${timestamp}-${randomString}${extension}`;

      try {
        // Process image with Sharp
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Create Sharp instance and apply rotation if needed
        let sharpInstance = sharp(buffer)
          .jpeg({ quality: 85, progressive: true })
          .png({ compressionLevel: 6 })
          .webp({ quality: 85 });

        // Apply rotation if specified
        if (rotation > 0) {
          sharpInstance = sharpInstance.rotate(rotation);
        }

        // Auto-orient and remove EXIF data
        sharpInstance = sharpInstance.withMetadata(false);
        
        // Get processed buffer and metadata
        const processedBuffer = await sharpInstance.toBuffer();
        const metadata = await sharp(buffer).metadata();

        // Upload to Supabase Storage using regular client
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filename, processedBuffer, {
            contentType: file.type,
            cacheControl: '31536000', // 1 year
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          return NextResponse.json({ 
            success: false, 
            message: `Failed to upload ${file.name}: ${uploadError.message}` 
          }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filename);

        // Save to database with error handling
        let imageRecord;
        try {
          [imageRecord] = await knex('images')
            .insert({
              user_id: userId,
              filename: filename.split('/').pop(), // Just the filename without path
              original_name: file.name,
              file_path: filename, // Full path in Supabase
              url: publicUrl,
              file_size: processedBuffer.length,
              mime_type: file.type,
              rotation: rotation,
              original_width: metadata.width,
              original_height: metadata.height,
              processed_width: rotation === 90 || rotation === 270 ? metadata.height : metadata.width,
              processed_height: rotation === 90 || rotation === 270 ? metadata.width : metadata.height,
              storage_provider: 'supabase',
              listing_id: null
            })
            .returning(['id', 'filename', 'url', 'rotation']);
        } catch (dbError) {
          console.error('Database insert error:', dbError);
          
          // Clean up uploaded file if database insert fails
          await supabase.storage
            .from(bucketName)
            .remove([filename]);
            
          return NextResponse.json({ 
            success: false, 
            message: 'Database error while saving image' 
          }, { status: 500 });
        }

        uploadedImages.push({
          id: imageRecord.id,
          filename: imageRecord.filename,
          url: imageRecord.url,
          originalName: file.name,
          rotation: imageRecord.rotation || 0
        });

      } catch (processingError) {
        console.error('Image processing error:', processingError);
        return NextResponse.json({ 
          success: false, 
          message: `Failed to process image: ${file.name}. ${processingError.message}` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded and processed successfully`
    });

  } catch (error) {
    console.error('Image upload error:', error);
    
    return NextResponse.json({ 
      success: false,
      message: 'Failed to upload images',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload failed'
    }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    const userId = searchParams.get('user_id');

    if (!listingId && !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'listing_id or user_id parameter required' 
      }, { status: 400 });
    }

    let query = knex('images').select('*');

    if (listingId) {
      query = query.where('listing_id', listingId);
    } else {
      query = query.where('user_id', userId);
    }

    const images = await query.orderBy('created_at', 'desc');

    return NextResponse.json({
      success: true,
      images: images.map(img => ({
        id: img.id,
        filename: img.filename,
        url: img.url,
        originalName: img.original_name,
        rotation: img.rotation || 0,
        width: img.processed_width || img.original_width,
        height: img.processed_height || img.original_height,
        createdAt: img.created_at
      }))
    });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch images'
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Image ID required' 
      }, { status: 400 });
    }

    // Find and verify ownership
    const image = await knex('images')
      .where('id', imageId)
      .where('user_id', userId)
      .first();

    if (!image) {
      return NextResponse.json({ 
        success: false, 
        message: 'Image not found or access denied' 
      }, { status: 404 });
    }

    // Delete from database first
    await knex('images').where('id', imageId).del();

    // Delete from Supabase Storage
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';
    const { error: deleteError } = await supabase.storage
      .from(bucketName)
      .remove([image.file_path]);

    if (deleteError) {
      console.warn('Could not delete file from Supabase:', deleteError.message);
    }

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting image:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: false,
      message: 'Failed to delete image'
    }, { status: 500 });
  }
}