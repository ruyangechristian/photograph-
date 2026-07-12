import { NextResponse } from 'next/server'
import { getBookings, setBookings } from '@/lib/store'
import { sendBookingEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, sessionType, date, message } = body
    if (!name || !email || !phone || !sessionType || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
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
    const emailResult = await sendBookingEmail(booking)
    if (emailResult.skipped) {
      return NextResponse.json({ ok: true, booking, warning: 'Saved but email not sent (check Gmail credentials)' }, { status: 201 })
    }
    if (!emailResult.ok) {
      return NextResponse.json({ ok: true, booking, warning: 'Saved but email failed to send' }, { status: 201 })
    }
    return NextResponse.json({ ok: true, booking }, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    const message = error instanceof Error ? error.message : 'Server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
