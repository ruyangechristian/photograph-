import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Image from '@/models/Image'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

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

    const buffer = Buffer.from(await file.arrayBuffer())
    const { url, public_id } = await uploadImage(buffer) as { url: string, public_id: string }

    const newImage = new Image({
      public_id,
      url
    })

    await newImage.save()

    return NextResponse.json(
      { success: true, image: newImage },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error uploading image:', error)
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

    // Delete from Cloudinary first
    await deleteImage(publicId)

    // Then delete from MongoDB
    await Image.findOneAndDelete({ public_id: publicId })

    return NextResponse.json(
      { success: true, message: 'Image deleted successfully' }
    )
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}