import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Album from '@/models/album.model'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

export const maxDuration = 300 // 5 minutes
export const dynamic = 'force-dynamic'

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

    // Validate file sizes (10MB limit per image)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    const MAX_TOTAL_SIZE = 200 * 1024 * 1024 // 200MB total limit
    
    // Check total size of all images
    let totalSize = coverImage.size
    for (const image of images) {
      totalSize += image.size
      if (image.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: 'One or more images are too large. Maximum size is 10MB per image' },
          { status: 400 }
        )
      }
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { error: 'Total size of all images is too large. Maximum total size is 200MB' },
        { status: 400 }
      )
    }

    let uploadedImages = []
    let errors = []

    // Upload cover image with retry
    let coverUrl = ''
    let coverPublicId = ''
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const coverBuffer = Buffer.from(await coverImage.arrayBuffer())
        const result = await uploadImage(coverBuffer)
        coverUrl = result.url
        coverPublicId = result.public_id
        break
      } catch (error) {
        if (attempt === 3) {
          console.error('Failed to upload cover image after 3 attempts:', error)
          errors.push('Failed to upload cover image')
          throw new Error('Failed to upload cover image')
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    // Upload album images in smaller chunks with retry
    const CHUNK_SIZE = 5 // Reduced chunk size
    for (let i = 0; i < images.length; i += CHUNK_SIZE) {
      const chunk = images.slice(i, i + CHUNK_SIZE)
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const chunkUploads = await Promise.all(
            chunk.map(async (image: File) => {
              try {
                const buffer = Buffer.from(await image.arrayBuffer())
                const { url, public_id } = await uploadImage(buffer)
                return { url, public_id }
              } catch (error) {
                console.error(`Error uploading image:`, error)
                errors.push(`Failed to upload image ${image.name}`)
                return null
              }
            })
          )
          // Filter out failed uploads and add successful ones
          uploadedImages.push(...chunkUploads.filter(Boolean))
          break // If successful, move to next chunk
        } catch (error) {
          if (attempt === 3) {
            console.error(`Failed to upload chunk after 3 attempts:`, error)
            errors.push(`Failed to upload chunk of images`)
          } else {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          }
        }
      }
    }

    // Only create album if we have at least one image uploaded
    if (uploadedImages.length === 0) {
      // Clean up cover image if no other images were uploaded
      if (coverPublicId) {
        try {
          await deleteImage(coverPublicId)
        } catch (error) {
          console.error('Failed to clean up cover image:', error)
        }
      }
      return NextResponse.json(
        { error: 'Failed to upload any images. Please try again.' },
        { status: 500 }
      )
    }

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
      { 
        success: true, 
        album: newAlbum,
        message: `Successfully uploaded ${uploadedImages.length + 1} images`,
        warnings: errors.length > 0 ? errors : undefined
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating album:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Upload timed out. Please try again with fewer images or smaller file sizes.' },
        { status: 504 }
      )
    }
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

    let deletedImages = 0
    let errors = []

    // Delete cover image with retry
    let coverDeleted = false
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await deleteImage(album.coverImage.public_id)
        coverDeleted = true
        deletedImages++
        break
      } catch (error) {
        if (attempt === 3) {
          console.error('Failed to delete cover image after 3 attempts:', error)
          errors.push('Failed to delete cover image')
        } else {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    // Delete album images in smaller chunks with retry
    const CHUNK_SIZE = 5 // Reduced chunk size
    const images = [...album.images]
    
    for (let i = 0; i < images.length; i += CHUNK_SIZE) {
      const chunk = images.slice(i, i + CHUNK_SIZE)
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await Promise.all(
            chunk.map(async (image: { public_id: string }) => {
              try {
                await deleteImage(image.public_id)
                deletedImages++
              } catch (error) {
                console.error(`Error deleting image ${image.public_id}:`, error)
                errors.push(`Failed to delete image ${image.public_id}`)
              }
            })
          )
          break // If successful, move to next chunk
        } catch (error) {
          if (attempt === 3) {
            console.error(`Failed to delete chunk after 3 attempts:`, error)
            errors.push(`Failed to delete chunk of images`)
          } else {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          }
        }
      }
    }

    // Only delete from database if we successfully deleted at least the cover image
    if (coverDeleted) {
      await Album.findByIdAndDelete(id)
    } else {
      return NextResponse.json(
        { 
          error: 'Failed to delete album - could not delete cover image',
          details: errors
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Album deleted successfully',
        deletedImages,
        warnings: errors.length > 0 ? errors : undefined
      }
    )
  } catch (error) {
    console.error('Error deleting album:', error)
    if (error instanceof Error && error.name === 'TimeoutError') {
      return NextResponse.json(
        { error: 'Delete operation timed out. Please try again.' },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    )
  }
}