'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userStr = localStorage.getItem('user')

    if (!token || !userStr) {
      router.push('/login')
      return
    }

    const user = JSON.parse(userStr)

    // Check if user needs to change password
    if (user.isFirstLogin && pathname !== '/change-password') {
      router.push('/change-password')
      return
    }

    // Verify user has access to current route
    const role = user.role
    const path = pathname.split('/')[1]

    const allowedPaths: Record<string, string[]> = {
      admin: ['admin', 'super_admin'],
      teacher: ['teacher'],
      student: ['student'],
      parent: ['parent'],
    }

    if (!allowedPaths[path]?.includes(role)) {
      // Redirect to appropriate dashboard based on role
      switch (role) {
        case 'super_admin':
        case 'admin':
          router.push('/admin')
          break
        case 'teacher':
          router.push('/teacher')
          break
        case 'student':
          router.push('/student')
          break
        case 'parent':
          router.push('/parent')
          break
        default:
          router.push('/login')
      }
    }
  }, [pathname, router])

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar will be added here */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
