'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  verifySessionToken,
} from '@/lib/adminSession'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

export async function login(formData: FormData) {
  const password = formData.get('password') as string

  if (!ADMIN_PASSWORD) {
    console.error('[auth] ADMIN_PASSWORD is not set; refusing all logins')
    return { success: false, error: 'Login is unavailable' }
  }

  if (password !== ADMIN_PASSWORD) {
    return { success: false, error: 'Invalid password' }
  }

  // A signed, expiring token — not a fixed string an attacker can just set.
  const token = await createSessionToken()
  if (!token) {
    return { success: false, error: 'Login is unavailable' }
  }

  ;(await cookies()).set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  })

  return { success: true }
}

export async function logout() {
  ;(await cookies()).delete(ADMIN_COOKIE_NAME)
  redirect('/admin/login')
}

export async function checkAuth() {
  const cookie = (await cookies()).get(ADMIN_COOKIE_NAME)
  return verifySessionToken(cookie?.value)
}
