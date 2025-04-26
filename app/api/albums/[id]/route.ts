import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Album from '@/models/album.model'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB()
    const { id } = await params
    const album = await Album.findById(id)
    
    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(album)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    )
  }
}