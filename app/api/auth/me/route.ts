import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSessions } from '@/lib/store'

const SESSION_COOKIE = 'ireme-admin-session'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value
    if (!sessionId) {
      return NextResponse.json({ authenticated: false })
    }
    const sessions = await getSessions()
    const valid = sessions.some((s) => s.id === sessionId)
    return NextResponse.json({ authenticated: valid })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false, error: 'Database connection failed' }, { status: 500 })
  }
}
