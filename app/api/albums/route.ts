import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Album from '@/models/album.model'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export async function GET() {
  try {
    await connectToDB()
    const albums = await Album.find().sort({ createdAt: -1 })
    return NextResponse.json(albums)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const coverImage = formData.get('coverImage') as File
    const images = formData.getAll('images') as File[]

    if (!title || !date || !coverImage || images.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload cover image
    const coverBuffer = Buffer.from(await coverImage.arrayBuffer())
    const { url: coverUrl, public_id: coverPublicId } = await uploadImage(coverBuffer)

    // Upload album images
    const uploadedImages = await Promise.all(
      images.map(async (image: File) => {
        const buffer = Buffer.from(await image.arrayBuffer())
        const { url, public_id } = await uploadImage(buffer)
        return { url, public_id }
      })
    )

    const newAlbum = new Album({
      title,
      date,
      coverImage: {
        url: coverUrl,
        public_id: coverPublicId,
      },
      images: uploadedImages,
    })

    await newAlbum.save()

    return NextResponse.json(
      { success: true, album: newAlbum },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating album:', error)
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const coverImage = formData.get('coverImage') as File | null
    const images = formData.getAll('images') as File[]

    if (!id || !title || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingAlbum = await Album.findById(id)
    if (!existingAlbum) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      )
    }

    // Update cover image if provided
    let coverUrl = existingAlbum.coverImage.url
    let coverPublicId = existingAlbum.coverImage.public_id
    if (coverImage) {
      // Delete old cover image
      await deleteImage(existingAlbum.coverImage.public_id)
      // Upload new cover image
      const coverBuffer = Buffer.from(await coverImage.arrayBuffer())
      const uploaded = await uploadImage(coverBuffer)
      coverUrl = uploaded.url
      coverPublicId = uploaded.public_id
    }

    // Upload new images if provided
    let updatedImages = [...existingAlbum.images]
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map(async (image: File) => {
          const buffer = Buffer.from(await image.arrayBuffer())
          const { url, public_id } = await uploadImage(buffer)
          return { url, public_id }
        })
      )
      updatedImages = [...updatedImages, ...uploadedImages]
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      id,
      {
        title,
        date,
        coverImage: {
          url: coverUrl,
          public_id: coverPublicId,
        },
        images: updatedImages,
      },
      { new: true }
    )

    return NextResponse.json(
      { success: true, album: updatedAlbum },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating album:', error)
    return NextResponse.json(
      { error: 'Failed to update album' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Album ID is required' },
        { status: 400 }
      )
    }

    const album = await Album.findById(id)
    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      )
    }

    // Delete images from Cloudinary
    await deleteImage(album.coverImage.public_id)
    await Promise.all(
      album.images.map((image: { public_id: string }) => 
        deleteImage(image.public_id)
      )
    )

    // Delete from database
    await Album.findByIdAndDelete(id)

    return NextResponse.json(
      { success: true, message: 'Album deleted successfully' }
    )
  } catch (error) {
    console.error('Error deleting album:', error)
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    )
  }
}