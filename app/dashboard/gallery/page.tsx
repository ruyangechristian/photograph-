"use client";

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface ImageType {
  _id: string
  public_id: string
  url: string
  createdAt: string
}

export default function ImageUploadPage() {
  const [images, setImages] = useState<ImageType[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/images')
        const data = await response.json()
        setImages(data)
      } catch (err) {
        setError('Failed to load images')
        console.error(err)
      }
    }
    fetchImages()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      const filesArray = Array.from(files)
      let uploadedCount = 0
      const failedFiles: string[] = []

      for (const file of filesArray) {
        try {
          // Validate file
          if (!file.type.match('image.*')) {
            failedFiles.push(`${file.name}: Not an image file`)
            continue
          }

          if (file.size > 10 * 1024 * 1024) {
            failedFiles.push(`${file.name}: File too large (max 10MB)`)
            continue
          }

          // Upload file
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch('/api/images', {
            method: 'POST',
            body: formData
          })

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            failedFiles.push(`${file.name}: ${errorData.error || 'Upload failed'}`)
            continue
          }

          const responseData = await response.json()
          if (responseData.image) {
            setImages(prev => [responseData.image, ...prev])
            uploadedCount++
          } else {
            failedFiles.push(`${file.name}: Invalid response from server`)
          }
        } catch (err) {
          failedFiles.push(`${file.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }

      // Show summary message
      if (uploadedCount > 0) {
        let message = `Successfully uploaded ${uploadedCount} image(s)`
        if (failedFiles.length > 0) {
          message += `\n\nFailed uploads:\n${failedFiles.join('\n')}`
        }
        console.log(message)
      } else if (failedFiles.length > 0) {
        setError(`Failed to upload images:\n${failedFiles.join('\n')}`)
      }
    } catch (err) {
      setError(`Upload error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      console.error('[Gallery Upload]', err)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  const handleDeleteImage = async (publicId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return

    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch(`/api/images?id=${publicId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      setImages(prev => prev.filter(img => img.public_id !== publicId))
    } catch (err) {
      setError('Failed to delete image')
      console.error(err)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-3xl md:text-4xl font-light mb-4">UPLOAD IMAGES</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload and manage your images
        </p>
      </div>

      <div className="mb-8">
        <label className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed">
          {isUploading ? 'Uploading...' : 'Select Images'}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={isUploading || isDeleting}
          />
        </label>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image._id} className="relative group">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Image
                  src={image.url}
                  alt={`Uploaded ${image.public_id}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
              <button
                onClick={() => handleDeleteImage(image.public_id)}
                disabled={isDeleting}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <p>No images uploaded yet.</p>
        </div>
      )}

      {(isUploading || isDeleting) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-center">
              {isUploading ? 'Uploading images...' : 'Deleting image...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
