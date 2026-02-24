// Upload validation and utilities

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, GIF, WebP`
    }
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File size ${sizeMB}MB exceeds maximum of 10MB`
    }
  }

  // Check file name
  if (!file.name || file.name.length === 0) {
    return {
      valid: false,
      error: 'File must have a valid name'
    }
  }

  return { valid: true }
}

export function validateImageFiles(files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (files.length === 0) {
    return {
      valid: false,
      errors: ['No files selected']
    }
  }

  files.forEach((file, index) => {
    const validation = validateImageFile(file)
    if (!validation.valid && validation.error) {
      errors.push(`File ${index + 1} (${file.name}): ${validation.error}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ url: string; public_id: string; image: any }> {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file')
  }

  // Create FormData
  const formData = new FormData()
  formData.append('file', file)

  try {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100
          onProgress(percentComplete)
        }
      })
    }

    return new Promise((resolve, reject) => {
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.image) {
              resolve({
                url: response.image.url,
                public_id: response.image.public_id,
                image: response.image
              })
            } else {
              reject(new Error(response.error || 'Upload failed'))
            }
          } catch (e) {
            reject(new Error('Invalid server response'))
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText)
            reject(new Error(error.error || `Upload failed with status ${xhr.status}`))
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'))
      })

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout - please try again'))
      })

      xhr.timeout = 60000 // 60 seconds
      xhr.open('POST', '/api/images')
      xhr.send(formData)
    })
  } catch (error) {
    throw error instanceof Error ? error : new Error('Upload failed')
  }
}
