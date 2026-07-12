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
    const { getBookings } = await import('@/lib/store')
    const bookings = await getBookings()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Get bookings error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { name, email, phone, sessionType, date, message } = body
    if (!name || !email || !phone || !sessionType || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const { getBookings, setBookings } = await import('@/lib/store')
    const bookings = await getBookings()
    const booking = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      sessionType,
      date,
      message: message || '',
      createdAt: new Date().toISOString(),
    }
    bookings.push(booking)
    await setBookings(bookings)
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Add booking error:', error)
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
    const { getBookings, setBookings } = await import('@/lib/store')
    let bookings = await getBookings()
    bookings = bookings.filter((b) => b.id !== id)
    await setBookings(bookings)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Delete booking error:', error)
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
  }
}
