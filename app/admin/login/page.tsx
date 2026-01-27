'use client'

import { useState } from 'react'
import { login } from '@/actions/auth'
import { useRouter } from 'next/navigation'
import { toast, Toaster } from 'sonner'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    try {
      const result = await login(formData)
      if (result.success) {
        router.push('/admin')
        router.refresh()
      } else {
        toast.error(result.error || 'Invalid password')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <img
            className="mx-auto h-16 w-auto" 
            src="/LOGO (2).png"
            alt="Eagles FC Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your password to access the admin dashboard
          </p>
        </div>
        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#C5A464] focus:border-[#C5A464] focus:z-10 sm:text-sm"
                placeholder="Admin Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#C5A464] hover:bg-[#B39355] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C5A464] transition-colors duration-200"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
        <Toaster position="top-center" richColors />
      </div>
    </div>
  )
} 