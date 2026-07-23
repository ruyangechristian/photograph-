import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSessions } from '@/lib/store'
import { v2 as cloudinary } from 'cloudinary'

const SESSION_COOKIE = 'ireme-admin-session'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function checkAuth() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return false
  const sessions = await getSessions()
  return sessions.some((s) => s.id === sessionId)
}

async function uploadSingle(file: File) {
  const bytes = new Uint8Array(await file.arrayBuffer())
  const buffer = Buffer.from(bytes)

  return await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'photograph',
        resource_type: file.type.startsWith('video') ? 'video' : 'image',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      },
    ).end(buffer)
  })
}

export async function POST(request: Request) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const form = await request.formData()
    const files = form.getAll('file') as File[]

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    const results = await Promise.allSettled(
      files.map(async (file) => {
        const result = await uploadSingle(file)
        return {
          filename: result.original_filename || file.name,
          url: result.secure_url,
          thumbnail: result.thumbnail_url,
        }
      }),
    )

    const successes = results
      .map((r, idx) => (r.status === 'fulfilled' ? { ...r.value, index: idx } : null))
      .filter((item): item is NonNullable<typeof item> => item !== null)

    const failures = results
      .map((r, idx) => (r.status === 'rejected' ? { index: idx, error: r.reason instanceof Error ? r.reason.message : 'Upload failed' } : null))
      .filter((item): item is NonNullable<typeof item> => item !== null)

    return NextResponse.json({
      results: successes,
      failures,
      total: files.length,
      successCount: successes.length,
    })
  } catch (error) {
    console.error('Batch upload error:', error)
    const message = error instanceof Error ? error.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
