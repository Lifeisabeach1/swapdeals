// src/app/api/images/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToken } from '@/lib/auth/jwt';
import sharp from 'sharp';
import path from 'path';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 }));
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 }));
    }
    
    const userId = decoded.id;

    // Parse Form Data
    const formData = await request.formData();
    const files = formData.getAll('images');
    const rotations = formData.getAll('rotations');

    if (!files || files.length === 0) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'No files uploaded' 
      }, { status: 400 }));
    }

    // Limit to 2 images
    if (files.length > 2) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Maximum 2 images allowed' 
      }, { status: 400 }));
    }

    const uploadedImages = [];
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';

    // Process Each File
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (!file.size) {
        continue;
      }

      // Validate file type - AVIF SUPPORT INCLUDED
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
      if (!allowedTypes.includes(file.type)) {
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and AVIF allowed.` 
        }, { status: 400 }));
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `File too large: ${file.name}. Maximum 10MB allowed.` 
        }, { status: 400 }));
      }

      // Get rotation value
      const rotation = parseInt(rotations[i]) || 0;
      const validRotations = [0, 90, 180, 270];
      if (!validRotations.includes(rotation)) {
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

      try {
        // Process Image with Sharp
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Get original metadata first
        const metadata = await sharp(buffer).metadata();

        // Create Sharp processing pipeline
        let sharpInstance = sharp(buffer)
          .withMetadata(false) // Remove EXIF data
          .jpeg({ quality: 85, progressive: true })
          .png({ compressionLevel: 6 });

        // Apply rotation if specified
        if (rotation > 0) {
          sharpInstance = sharpInstance.rotate(rotation);
        }

        // Process the image
        const processedBuffer = await sharpInstance.toBuffer();

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filename, processedBuffer, {
            contentType: file.type,
            cacheControl: '31536000', // 1 year
            upsert: false
          });

        if (uploadError) {
          console.error('Supabase upload error:', uploadError);
          return corsResponse(NextResponse.json({ 
            success: false, 
            message: `Failed to upload ${file.name}: ${uploadError.message}` 
          }, { status: 500 }));
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filename);

        // Save to Database
        const insertData = {
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
        };

        const { data: imageRecord, error: insertError } = await supabase
          .from('images')
          .insert(insertData)
          .select('id, filename, url, rotation, created_at')
          .single();
        
        if (insertError) {
          console.error('Database insert error:', insertError);
          
          // Clean up uploaded file if database insert fails
          try {
            await supabase.storage
              .from(bucketName)
              .remove([filename]);
          } catch (cleanupError) {
            console.error('File cleanup failed:', cleanupError);
          }
            
          return corsResponse(NextResponse.json({ 
            success: false, 
            message: 'Database error while saving image: ' + insertError.message 
          }, { status: 500 }));
        }

        uploadedImages.push({
          id: imageRecord.id,
          filename: imageRecord.filename,
          url: imageRecord.url,
          originalName: file.name,
          rotation: imageRecord.rotation || 0
        });

      } catch (processingError) {
        console.error('Error processing file:', processingError);
        return corsResponse(NextResponse.json({ 
          success: false, 
          message: `Failed to process image: ${file.name}. ${processingError.message}` 
        }, { status: 500 }));
      }
    }

    return corsResponse(NextResponse.json({
      success: true,
      images: uploadedImages,
      message: `${uploadedImages.length} image(s) uploaded and processed successfully`
    }));

  } catch (error) {
    console.error('Unexpected error in image upload:', error);
    
    return corsResponse(NextResponse.json({ 
      success: false,
      message: 'Internal server error during upload'
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

    let query = supabase.from('images').select('*');

    if (listingId) {
      query = query.eq('listing_id', listingId);
    } else {
      query = query.eq('user_id', userId);
    }

    const { data: images, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching images:', error);
      return corsResponse(NextResponse.json({ 
        success: false,
        message: 'Failed to fetch images'
      }, { status: 500 }));
    }

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
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 }));
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 }));
    }

    const userId = decoded.id;

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('id');

    if (!imageId) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Image ID required' 
      }, { status: 400 }));
    }

    // Find and verify ownership
    const { data: image, error: fetchError } = await supabase
      .from('images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !image) {
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Image not found or access denied' 
      }, { status: 404 }));
    }

    // Delete from database first
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId);

    if (deleteError) {
      console.error('Database delete error:', deleteError);
      return corsResponse(NextResponse.json({ 
        success: false, 
        message: 'Failed to delete image from database' 
      }, { status: 500 }));
    }

    // Delete from Supabase Storage
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';
    const { error: storageDeleteError } = await supabase.storage
      .from(bucketName)
      .remove([image.file_path]);

    if (storageDeleteError) {
      console.warn('Could not delete file from Supabase storage:', storageDeleteError.message);
    }

    return corsResponse(NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    }));

  } catch (error) {
    console.error('Error deleting image:', error);
    
    return corsResponse(NextResponse.json({ 
      success: false,
      message: 'Failed to delete image'
    }, { status: 500 }));
  }
}