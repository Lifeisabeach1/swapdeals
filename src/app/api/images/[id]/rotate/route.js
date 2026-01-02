// src/app/api/images/[id]/rotate/route.js
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

export async function POST(request, { params }) {
  try {
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
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ 
        success: false, 
        message: 'Authorization required' 
      }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid or expired token' 
      }, { status: 401 });
    }
    
    const userId = decoded.id;

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
    const { data: image, error: fetchError } = await supabase
      .from('images')
      .select('*')
      .eq('id', imageId)
      .eq('user_id', userId)
      .single();

    if (fetchError || !image) {
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

      // Get the processed buffer
      const processedBuffer = await sharpInstance.toBuffer();

      // Generate new filename to avoid caching issues
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = path.extname(image.filename);
      const newFilename = `${userId}/${timestamp}-${randomString}${extension}`;

      // Upload the rotated image to Supabase
      const { error: uploadError } = await supabase.storage
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
      const { error: updateError } = await supabase
        .from('images')
        .update({
          filename: newFilename.split('/').pop(),
          file_path: newFilename,
          url: publicUrl,
          file_size: processedBuffer.length,
          rotation: totalRotation,
          processed_width: newWidth,
          processed_height: newHeight,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId);

      if (updateError) {
        console.error('Database update error:', updateError);
        return NextResponse.json({
          success: false,
          message: 'Failed to update image record'
        }, { status: 500 });
      }

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
      const { data: updatedImage } = await supabase
        .from('images')
        .select('*')
        .eq('id', imageId)
        .single();

      return NextResponse.json({
        success: true,
        message: 'Image rotated successfully',
        image: {
          id: updatedImage?.id || imageId,
          filename: updatedImage?.filename || newFilename.split('/').pop(),
          url: updatedImage?.url || publicUrl,
          rotation: updatedImage?.rotation || totalRotation,
          width: updatedImage?.processed_width || newWidth,
          height: updatedImage?.processed_height || newHeight
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
    return NextResponse.json({
      success: false,
      message: 'Failed to rotate image'
    }, { status: 500 });
  }
}