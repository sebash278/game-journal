import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple JWT verification for middleware (Edge Runtime compatible)
function verifyTokenSimple(token: string): boolean {
  try {
    // Just check if token exists and has valid format (3 parts separated by dots)
    const parts = token.split('.')
    return parts.length === 3 && parts.every(part => part.length > 0)
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Get token from cookies
  const token = request.cookies.get('auth_token')?.value

  // Allow login and register pages without auth
  if (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register') {
    // If user has valid token, redirect to home
    if (token && verifyTokenSimple(token)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  // Redirect to login if no token or invalid format
  if (!token || !verifyTokenSimple(token)) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
