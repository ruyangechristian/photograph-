import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getSessions, saveSessions } from '@/lib/store'

const SESSION_COOKIE = 'ireme-admin-session'

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function POST(request: Request) {
  try {
    if (!request) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    let body: { username?: string; password?: string } = {}
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }
    const { username, password } = body
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }
    if (username === 'admin' && password === 'admin') {
      const session = { id: generateId(), createdAt: new Date().toISOString() }
      const sessions = await getSessions()
      sessions.push(session)
      await saveSessions(sessions)
      const cookieStore = await cookies()
      cookieStore.set(SESSION_COOKIE, session.id, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
