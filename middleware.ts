import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/adminSession'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
      return NextResponse.next()
    }

    // Verify the signature — the cookie's presence alone proves nothing.
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value
    if (!(await verifySessionToken(token))) {
      const loginUrl = new URL('/admin/login', request.url)
      const response = NextResponse.redirect(loginUrl)
      // Clear a forged or expired cookie so it stops being replayed.
      response.cookies.delete(ADMIN_COOKIE_NAME)
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
