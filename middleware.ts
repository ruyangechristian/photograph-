// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/api/auth/login'
  
  // Check for session cookie set by auth.ts
  const session = request.cookies.get('session')?.value
  const isAuthenticated = !!session

  // Protect non-public routes
  if (!isAuthenticated && !isPublicPath && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }

  // Redirect authenticated users away from login
  if (isAuthenticated && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/api/albums/:path*',
    '/api/images/:path*',
  ],
}
