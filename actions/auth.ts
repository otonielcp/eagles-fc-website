'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const COOKIE_NAME = 'admin_auth'

export async function login(formData: FormData) {
  const password = formData.get('password') as string

  if (password === ADMIN_PASSWORD) {
    // Set an HTTP-only cookie
    (await
      // Set an HTTP-only cookie
      cookies()).set(COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })
    return { success: true }
  }

  return { success: false, error: 'Invalid password' }
}

export async function logout() {
  (await cookies()).delete(COOKIE_NAME)
  redirect('/admin/login')
}

export async function checkAuth() {
  const cookie = (await cookies()).get(COOKIE_NAME)
  return cookie?.value === 'authenticated'
} 