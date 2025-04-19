// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login'
  
  // Only check cookies in middleware (server-side)
  const isAuthenticated = request.cookies.get('isAuthenticated')?.value === 'true'

  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}