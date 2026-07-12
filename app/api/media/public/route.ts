import { NextResponse } from 'next/server'
import { getMedia } from '@/lib/store'

export async function GET() {
  try {
    const media = await getMedia()
    return NextResponse.json(media)
  } catch (error) {
    console.error('Get public media error:', error)
    return NextResponse.json({ error: 'Failed to load media' }, { status: 500 })
  }
}
