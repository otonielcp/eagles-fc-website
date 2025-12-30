import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Check if it's an admin path
  if (path.startsWith('/admin')) {
    // Allow access to login page
    if (path === '/admin/login') {
      return NextResponse.next()
    }

    // Check for auth cookie
    const authCookie = request.cookies.get('admin_auth')

    // Redirect to login if no auth cookie
    if (!authCookie || authCookie.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
} 