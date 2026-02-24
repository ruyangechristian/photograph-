import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Image from '@/models/Image'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { errorResponse, serverErrorResponse } from '@/lib/api-utils'

export const maxDuration = 60 // 1 minute
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function POST(request: Request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return errorResponse('No file provided', 400)
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed', 400)
    }

    // Validate file size (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return errorResponse('Image is too large. Maximum size is 10MB', 400)
    }

    // Upload image with retry
    let url = ''
    let public_id = ''
    let uploadError = null

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const result = await uploadImage(buffer)
        url = result.url
        public_id = result.public_id
        uploadError = null
        break
      } catch (error) {
        uploadError = error
        if (attempt === 3) {
          console.error('Failed to upload image after 3 attempts:', error)
          throw new Error('Failed to upload image after multiple attempts')
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    if (uploadError) {
      throw uploadError
    }

    const newImage = new Image({
      public_id,
      url
    })

    await newImage.save()

    // Return both wrapped response and direct image for client compatibility
    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      image: newImage,
      data: newImage
    }, { status: 201 })
  } catch (error) {
    console.error('[API] Error uploading image:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return errorResponse('Upload timed out. Please try again with a smaller file.', 504)
    }
    return serverErrorResponse(error)
  }
}

export async function GET() {
  try {
    await connectToDB()
    const images = await Image.find().sort({ createdAt: -1 })
    // Return images as direct array for client compatibility
    return NextResponse.json(images)
  } catch (error) {
    console.error('[API] Error fetching images:', error)
    return serverErrorResponse(error)
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDB()
    
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('id')

    if (!publicId) {
      return errorResponse('Image ID is required', 400)
    }

    // Delete from Cloudinary with retry
    let deleteError = null
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await deleteImage(publicId)
        deleteError = null
        break
      } catch (error) {
        deleteError = error
        if (attempt === 3) {
          console.error('Failed to delete image after 3 attempts:', error)
          throw new Error('Failed to delete image after multiple attempts')
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    if (deleteError) {
      throw deleteError
    }

    // Then delete from MongoDB
    await Image.findOneAndDelete({ public_id: publicId })

    return successResponse(null, 'Image deleted successfully')
  } catch (error) {
    console.error('[API] Error deleting image:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return errorResponse('Delete operation timed out. Please try again.', 504)
    }
    return serverErrorResponse(error)
  }
}
