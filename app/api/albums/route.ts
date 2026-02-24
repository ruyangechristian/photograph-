import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Album from '@/models/album.model'
import { uploadImage, deleteImage } from '@/lib/cloudinary'
import { successResponse, errorResponse, serverErrorResponse } from '@/lib/api-utils'

export const maxDuration = 60 // 1 minute
export const dynamic = 'force-dynamic'

// ================= GET =================
export async function GET() {
  try {
    await connectToDB()
    const albums = await Album.find().sort({ createdAt: -1 })
    return successResponse(albums, 'Albums fetched successfully')
  } catch (error) {
    console.error('[API] Error fetching albums:', error)
    return serverErrorResponse(error)
  }
}

// ================= POST =================
export async function POST(request: Request) {
  try {
    await connectToDB()

    const formData = await request.formData()
    const title = formData.get('title') as string
    const date = formData.get('date') as string
    const coverImage = formData.get('coverImage') as File
    const images = formData.getAll('images') as File[]

    if (!title || !date || !coverImage || images.length === 0) {
      return errorResponse('Missing required fields: title, date, coverImage, and images', 400)
    }
    
    if (title.trim().length < 3) {
      return errorResponse('Album title must be at least 3 characters long', 400)
    }

    let uploadedImages: { url: string; public_id: string }[] = []
    let errors: string[] = []

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
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    // Upload album images in chunks with retry
    const CHUNK_SIZE = 5
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
          uploadedImages.push(...chunkUploads.filter(Boolean) as any)
          break
        } catch (error) {
          if (attempt === 3) {
            console.error(`Failed to upload chunk after 3 attempts:`, error)
            errors.push(`Failed to upload chunk of images`)
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          }
        }
      }
    }

    if (uploadedImages.length === 0) {
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

    return successResponse(
      {
        album: newAlbum,
        uploadedCount: uploadedImages.length + 1,
        warnings: errors.length > 0 ? errors : undefined,
      },
      `Successfully uploaded ${uploadedImages.length + 1} images`,
      201
    )
  } catch (error) {
    console.error('[API] Error creating album:', error)
    return serverErrorResponse(error)
  }
}

// ================= PUT =================
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
      return errorResponse('Missing required fields: id, title, and date', 400)
    }

    const existingAlbum = await Album.findById(id)
    if (!existingAlbum) {
      return errorResponse('Album not found', 404)
    }

    // Update cover image if provided
    let coverUrl = existingAlbum.coverImage.url
    let coverPublicId = existingAlbum.coverImage.public_id
    if (coverImage) {
      await deleteImage(existingAlbum.coverImage.public_id)
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

    return successResponse(updatedAlbum, 'Album updated successfully')
  } catch (error) {
    console.error('[API] Error updating album:', error)
    return serverErrorResponse(error)
  }
}

// ================= DELETE =================
export async function DELETE(request: Request) {
  try {
    await connectToDB()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return errorResponse('Album ID is required', 400)
    }

    const album = await Album.findById(id)
    if (!album) {
      return errorResponse('Album not found', 404)
    }

    let deletedImages = 0
    let errors: string[] = []

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
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    }

    // Delete album images in chunks with retry
    const CHUNK_SIZE = 5
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
          break
        } catch (error) {
          if (attempt === 3) {
            console.error(`Failed to delete chunk after 3 attempts:`, error)
            errors.push(`Failed to delete chunk of images`)
          } else {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
          }
        }
      }
    }

    if (coverDeleted) {
      await Album.findByIdAndDelete(id)
    } else {
      return serverErrorResponse(
        `Failed to delete album - could not delete cover image. Details: ${errors.join(', ')}`
      )
    }

    return successResponse(
      { deletedImages, warnings: errors.length > 0 ? errors : undefined },
      'Album deleted successfully'
    )
  } catch (error) {
    console.error('[API] Error deleting album:', error)
    return serverErrorResponse(error)
  }
}
