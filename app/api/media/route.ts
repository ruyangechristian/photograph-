import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSessions } from '@/lib/store'

const SESSION_COOKIE = 'ireme-admin-session'

async function checkAuth() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return false
  const sessions = await getSessions()
  return sessions.some((s) => s.id === sessionId)
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { getMedia } = await import('@/lib/store')
    const media = await getMedia()
    return NextResponse.json(media)
  } catch (error) {
    console.error('Get media error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { getMedia, setMedia } = await import('@/lib/store')
    const media = await getMedia()

    const addItem = (item: any) => {
      media.push({
        id: item.id || Date.now().toString() + Math.random(),
        title: item.title,
        category: item.category,
        type: item.type,
        url: item.url,
        thumbnail: item.thumbnail || '',
        createdAt: item.createdAt || new Date().toISOString(),
      })
    }

    if (Array.isArray(body.media)) {
      for (const item of body.media) {
        if (item.title && item.category && item.type && item.url) {
          addItem(item)
        }
      }
      await setMedia(media)
      return NextResponse.json({ ok: true }, { status: 201 })
    }

    const { title, category, type, url, thumbnail } = body
    if (!title || !category || !type || !url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    addItem({ title, category, type, url, thumbnail })
    await setMedia(media)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('Add media error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { id } = body
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    const { getMedia, setMedia } = await import('@/lib/store')
    let media = await getMedia()
    media = media.filter((m) => m.id !== id)
    await setMedia(media)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}
