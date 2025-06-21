// src/app/api/images/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { knex } from '@/lib/db/index.js';
import { supabase } from '@/lib/supabase.js';
import sharp from 'sharp';
import path from 'path';

// Add CORS headers helper
function corsResponse(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request) {
  return corsResponse(new NextResponse(null, { status: 200 }));
}

export async function POST(request) {
  console.log('=== Image Upload API Called ===');
  
  try {
    // 1. Environment Variables Check
    console.log('Checking environment variables...');
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET environment variable is not set');
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Server configuration error: JWT_SECRET missing' 
      }, { status: 500 }));
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('❌ Supabase environment variables are not set');
      console.error('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.error('SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Server configuration error: Supabase config missing' 
      }, { status: 500 }));
    }
    console.log('✅ Environment variables OK');

    // 2. Authentication Check
    console.log('Checking authentication...');
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('❌ No valid auth header found');
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 }));
    }
    
    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ JWT verified successfully');
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 }));
    }
    
    const userId = decoded.userId || decoded.id;
    
    if (!userId) {
      console.error('❌ No userId found in token');
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Invalid token payload' 
      }, { status: 401 }));
    }
    console.log('✅ User authenticated:', userId);

    // 3. Database Connection Test
    console.log('Testing database connection...');
    try {
      await knex.raw('SELECT 1');
      console.log('✅ Database connection OK');
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError.message);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Database connection error' 
      }, { status: 500 }));
    }

    // 4. Supabase Connection Test
    console.log('Testing Supabase connection...');
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) {
        console.error('❌ Supabase connection failed:', error.message);
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: 'Storage service unavailable' 
        }, { status: 500 }));
      }
      console.log('✅ Supabase connection OK');
    } catch (supabaseError) {
      console.error('❌ Supabase error:', supabaseError.message);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Storage service error' 
      }, { status: 500 }));
    }

    // 5. Parse Form Data
    console.log('Parsing form data...');
    let formData;
    try {
      formData = await request.formData();
      console.log('✅ Form data parsed successfully');
    } catch (formError) {
      console.error('❌ FormData parsing error:', formError.message);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Invalid form data format' 
      }, { status: 400 }));
    }

    const files = formData.getAll('images');
    const rotations = formData.getAll('rotations');

    console.log('Files received:', files.length);
    console.log('Rotations:', rotations);

    if (!files || files.length === 0) {
      console.error('❌ No files uploaded');
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'No files uploaded' 
      }, { status: 400 }));
    }

    // Limit to 2 images
    if (files.length > 2) {
      console.error('❌ Too many files:', files.length);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Maximum 2 images allowed' 
      }, { status: 400 }));
    }

    const uploadedImages = [];
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';
    console.log('Using bucket:', bucketName);

    // 6. Process Each File
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`\n--- Processing file ${i + 1}: ${file.name} ---`);
      
      if (!file.size) {
        console.warn('⚠️ Skipping empty file');
        continue;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.error('❌ Invalid file type:', file.type);
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP allowed.` 
        }, { status: 400 }));
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        console.error('❌ File too large:', file.size);
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `File too large: ${file.name}. Maximum 10MB allowed.` 
        }, { status: 400 }));
      }

      // Get rotation value
      const rotation = parseInt(rotations[i]) || 0;
      const validRotations = [0, 90, 180, 270];
      if (!validRotations.includes(rotation)) {
        console.error('❌ Invalid rotation:', rotation);
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `Invalid rotation value: ${rotation}. Must be 0, 90, 180, or 270.` 
        }, { status: 400 }));
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(file.name) || '.jpg';
      const filename = `${userId}/${timestamp}-${randomString}${extension}`;
      console.log('Generated filename:', filename);

      try {
        // 7. Process Image with Sharp
        console.log('Processing image with Sharp...');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Get original metadata first
        let metadata;
        try {
          metadata = await sharp(buffer).metadata();
          console.log('Original image metadata:', {
            width: metadata.width,
            height: metadata.height,
            format: metadata.format
          });
        } catch (sharpError) {
          console.error('❌ Sharp metadata error:', sharpError.message);
          return corsResponse(NextResponse.json({ 
            success: false, 
            message: `Invalid image file: ${file.name}` 
          }, { status: 400 }));
        }

        // Create Sharp processing pipeline
        let sharpInstance = sharp(buffer)
          .withMetadata(false) // Remove EXIF data
          .jpeg({ quality: 85, progressive: true })
          .png({ compressionLevel: 6 });

        // Apply rotation if specified
        if (rotation > 0) {
          console.log('Applying rotation:', rotation);
          sharpInstance = sharpInstance.rotate(rotation);
        }

        // Process the image
        const processedBuffer = await sharpInstance.toBuffer();
        console.log('✅ Image processed successfully, size:', processedBuffer.length);

        // 8. Upload to Supabase Storage
        console.log('Uploading to Supabase...');
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filename, processedBuffer, {
            contentType: file.type,
            cacheControl: '31536000', // 1 year
            upsert: false
          });

        if (uploadError) {
          console.error('❌ Supabase upload error:', uploadError);
          return corsResponse(NextResponse.json({ 
            success: false, 
            message: `Failed to upload ${file.name}: ${uploadError.message}` 
          }, { status: 500 }));
        }
        console.log('✅ File uploaded to Supabase');

        // 9. Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filename);
        console.log('Public URL generated:', publicUrl);

        // 10. Save to Database
        console.log('Saving to database...');
        let imageRecord;
        try {
          [imageRecord] = await knex('images')
            .insert({
              user_id: userId,
              filename: filename.split('/').pop(),
              original_name: file.name,
              file_path: filename,
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
          
          console.log('✅ Database record created:', imageRecord.id);
        } catch (dbError) {
          console.error('❌ Database insert error:', dbError.message);
          
          // Clean up uploaded file if database insert fails
          await supabase.storage
            .from(bucketName)
            .remove([filename]);
            
          return corsResponse(NextResponse.json({ 
            success: false, 
            message: 'Database error while saving image' 
          }, { status: 500 }));
        }

        uploadedImages.push({
          id: imageRecord.id,
          filename: imageRecord.filename,
          url: imageRecord.url,
          originalName: file.name,
          rotation: imageRecord.rotation || 0
        });

        console.log(`✅ File ${i + 1} processed successfully`);

      } catch (processingError) {
        console.error(`❌ Error processing file ${i + 1}:`, processingError.message);
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `Failed to process image: ${file.name}. ${processingError.message}` 
        }, { status: 500 }));
      }
    }

    console.log(`\n🎉 All files processed successfully! Uploaded ${uploadedImages.length} images`);

    return corsResponse(NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded and processed successfully`
    }));

  } catch (error) {
    console.error('💥 Unexpected error in image upload:', error);
    console.error('Error stack:', error.stack);
    
    return corsResponse(NextResponse.json({ 
      success: false,
      message: 'Internal server error during upload',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Upload failed'
    }, { status: 500 }));
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listing_id');
    const userId = searchParams.get('user_id');

    if (!listingId && !userId) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'listing_id or user_id parameter required' 
      }, { status: 400 }));
    }

    let query = knex('images').select('*');

    if (listingId) {
      query = query.where('listing_id', listingId);
    } else {
      query = query.where('user_id', userId);
    }

    const images = await query.orderBy('created_at', 'desc');

    return corsResponse(NextResponse.json({
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
    }));

  } catch (error) {
    console.error('Error fetching images:', error);
    return corsResponse(NextResponse.json({ 
      success: false,
      message: 'Failed to fetch images'
    }, { status: 500 }));
  }
}

export async function DELETE(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 }));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id;

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Image ID required' 
      }, { status: 400 }));
    }

    // Find and verify ownership
    const image = await knex('images')
      .where('id', imageId)
      .where('user_id', userId)
      .first();

    if (!image) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Image not found or access denied' 
      }, { status: 404 }));
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

    return corsResponse(NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    }));

  } catch (error) {
    console.error('Error deleting image:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 }));
    }
    
    return corsResponse(NextResponse.json({ 
      success: false,
      message: 'Failed to delete image'
    }, { status: 500 }));
  }
}