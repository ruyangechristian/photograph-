import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    await clearSession()
    
    return NextResponse.json(
      { success: true, message: 'Logged out successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[API] Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}
