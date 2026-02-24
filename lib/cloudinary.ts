import { v2 as cloudinary } from 'cloudinary'

// Validate Cloudinary credentials
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('[Cloudinary] Missing required environment variables')
  console.error('[Cloudinary] Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET')
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export async function uploadImage(
  file: Buffer | string,
  folder: string = process.env.CLOUDINARY_FOLDER || 'albums'
): Promise<{ url: string; public_id: string }> {
  // Check if Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
    throw new Error('Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY environment variables.')
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error.message)
          return reject(new Error(`Cloudinary upload failed: ${error.message}`))
        }
        if (!result) {
          return reject(new Error('Upload failed: No result from Cloudinary'))
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        } as { url: string; public_id: string })
      }
    )

    // Add timeout
    const timeout = setTimeout(() => {
      uploadStream.destroy()
      reject(new Error('Upload timeout: Request took too long'))
    }, 60000) // 60 seconds

    uploadStream.on('end', () => {
      clearTimeout(timeout)
    })

    if (typeof file === 'string') {
      try {
        uploadStream.end(Buffer.from(file.split(',')[1], 'base64'))
      } catch (error) {
        clearTimeout(timeout)
        reject(new Error('Failed to process base64 file'))
      }
    } else {
      uploadStream.end(file)
    }
  })
}

export async function deleteImage(public_id: string): Promise<void> {
  if (!public_id) {
    throw new Error('Public ID is required for deletion')
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Delete timeout: Request took too long'))
    }, 30000) // 30 seconds

    cloudinary.uploader.destroy(public_id, (error, result) => {
      clearTimeout(timeout)
      if (error) {
        console.error('[Cloudinary] Delete error:', error.message)
        return reject(new Error(`Cloudinary delete failed: ${error.message}`))
      }
      if (result && result.result === 'not found') {
        return reject(new Error('Image not found on Cloudinary'))
      }
      resolve()
    })
  })
}

export default cloudinary
