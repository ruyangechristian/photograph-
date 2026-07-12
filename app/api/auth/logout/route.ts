import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSessions, saveSessions } from '@/lib/store'

const SESSION_COOKIE = 'ireme-admin-session'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value
    if (sessionId) {
      let sessions = await getSessions()
      sessions = sessions.filter((s) => s.id !== sessionId)
      await saveSessions(sessions)
      cookieStore.delete(SESSION_COOKIE)
    }
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
