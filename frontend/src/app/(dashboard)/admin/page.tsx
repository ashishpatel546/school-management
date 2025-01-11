'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
  const [user] = useState(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    }
    return null
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.firstName} {user?.lastName}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>Manage classes, subjects, and fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Configure Classes
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Configure Subjects
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Set Class Fees
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Users
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Reset Passwords
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Manage Admins
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extra Curriculum</CardTitle>
            <CardDescription>Manage extra curriculum activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Add Activities
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Set Activity Fees
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Enrollments
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Exam Management</CardTitle>
            <CardDescription>Configure and manage exams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Schedule Exams
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Exam Schedule
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Management</CardTitle>
            <CardDescription>Monitor and manage fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Fee Records
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Payment Reports
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance</CardTitle>
            <CardDescription>View attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Attendance
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Attendance Reports
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
