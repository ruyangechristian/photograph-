import { NextResponse } from 'next/server'
import connectToDB from '@/lib/mongoose'
import Album from '@/models/album.model'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB()
    const { id } = params // ✅ no await here
    const album = await Album.findById(id).lean() // ✅ returns plain JS object
    
    if (!album) {
      return NextResponse.json(
        { error: 'Album not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(album, { status: 200 }) // ✅ safe JSON
  } catch (error) {
    console.error('Error fetching album:', error) // log the real error
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    )
  }
}
