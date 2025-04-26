import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Image from '@/models/Image'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export const maxDuration = 60 // 1 minute
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Image is too large. Maximum size is 10MB' },
        { status: 400 }
      )
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

    return NextResponse.json(
      { 
        success: true, 
        image: newImage,
        message: 'Image uploaded successfully'
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading image:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Upload timed out. Please try again with a smaller file.' },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectToDB()
    const images = await Image.find().sort({ createdAt: -1 })
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDB()
    
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('id')

    if (!publicId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
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

    return NextResponse.json(
      { 
        success: true, 
        message: 'Image deleted successfully'
      }
    )
  } catch (error) {
    console.error('Error deleting image:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Delete operation timed out. Please try again.' },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}