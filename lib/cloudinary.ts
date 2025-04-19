import { v2 as cloudinary } from 'cloudinary'

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
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error)
        if (!result) return reject(new Error('Upload failed'))
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        } as { url: string; public_id: string }) // ✅ Added type cast
      }
    )

    if (typeof file === 'string') {
      uploadStream.end(Buffer.from(file.split(',')[1], 'base64'))
    } else {
      uploadStream.end(file)
    }
  })
}

export async function deleteImage(public_id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error)
      resolve()
    })
  })
}

export default cloudinary
