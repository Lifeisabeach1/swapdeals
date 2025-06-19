// src/app/api/images/[id]/rotate/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { knex } from '@/lib/db/index.js';
import { supabase } from '@/lib/supabase.js';
import sharp from 'sharp';
import path from 'path';

export async function POST(request, { params }) {
  try {
    // Await params before accessing properties
    const { id } = await params;
    const imageId = id;
    
    if (!imageId) {
      return NextResponse.json({
        success: false,
        message: 'Image ID is required'
      }, { status: 400 });
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

    // Get rotation from request body
    const body = await request.json();
    const { rotation } = body;

    // Validate rotation value
    const validRotations = [0, 90, 180, 270];
    if (!validRotations.includes(rotation)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid rotation value. Must be 0, 90, 180, or 270.'
      }, { status: 400 });
    }

    // Find the image and verify ownership
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

    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'images';
    
    try {
      // Download the current image from Supabase
      const { data: imageData, error: downloadError } = await supabase.storage
        .from(bucketName)
        .download(image.file_path);

      if (downloadError) {
        console.error('Download error:', downloadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to download image for rotation'
        }, { status: 500 });
      }

      // Convert blob to buffer
      const imageBuffer = Buffer.from(await imageData.arrayBuffer());
      
      // Process the image with the new rotation
      let sharpInstance = sharp(imageBuffer);
      
      // Apply the rotation
      if (rotation > 0) {
        sharpInstance = sharpInstance.rotate(rotation);
      }
      
      // Optimize the image
      sharpInstance = sharpInstance
        .jpeg({ quality: 85, progressive: true })
        .png({ compressionLevel: 6 })
        .webp({ quality: 85 })
        .withMetadata(false);

      // Get the processed buffer and new metadata
      const processedBuffer = await sharpInstance.toBuffer();
      const newMetadata = await sharpInstance.metadata();

      // Generate new filename to avoid caching issues
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(image.filename);
      const newFilename = `${userId}/${timestamp}-${randomString}${extension}`;

      // Upload the rotated image to Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(newFilename, processedBuffer, {
          contentType: image.mime_type,
          cacheControl: '31536000', // 1 year
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json({
          success: false,
          message: 'Failed to upload rotated image'
        }, { status: 500 });
      }

      // Get new public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(newFilename);

      // Calculate new dimensions based on rotation
      const currentRotation = image.rotation || 0;
      const totalRotation = (currentRotation + rotation) % 360;
      
      let newWidth, newHeight;
      if (totalRotation === 90 || totalRotation === 270) {
        // Dimensions are swapped for 90 and 270 degree rotations
        newWidth = image.original_height;
        newHeight = image.original_width;
      } else {
        // Original dimensions for 0 and 180 degree rotations
        newWidth = image.original_width;
        newHeight = image.original_height;
      }

      // Update the database record
      await knex('images')
        .where('id', imageId)
        .update({
          filename: newFilename.split('/').pop(),
          file_path: newFilename,
          url: publicUrl,
          file_size: processedBuffer.length,
          rotation: totalRotation,
          processed_width: newWidth,
          processed_height: newHeight,
          updated_at: knex.fn.now()
        });

      // Clean up the old file from Supabase
      try {
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([image.file_path]);
        
        if (deleteError) {
          console.warn('Could not delete old file from Supabase:', deleteError.message);
        }
      } catch (cleanupError) {
        console.warn('Could not delete old file:', cleanupError.message);
      }

      // Fetch the updated record
      const updatedImage = await knex('images')
        .where('id', imageId)
        .first();

      return NextResponse.json({
        success: true,
        message: 'Image rotated successfully',
        image: {
          id: updatedImage.id,
          filename: updatedImage.filename,
          url: updatedImage.url,
          rotation: updatedImage.rotation,
          width: updatedImage.processed_width,
          height: updatedImage.processed_height
        }
      });

    } catch (processingError) {
      console.error('Image rotation error:', processingError);
      return NextResponse.json({
        success: false,
        message: 'Failed to rotate image'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Rotate API error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to rotate image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Rotation failed'
    }, { status: 500 });
  }
}