'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// UI components
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'

interface Attendance {
  id: string
  date: string
  present: boolean
  class: {
    name: string
    grade: number
    section: string
  }
}

interface Exam {
  id: string
  name: string
  date: string
  subject: {
    name: string
    code: string
  }
}

interface Fee {
  id: string
  amount: number
  extraCurriculumFee: number
  totalAmount: number
  status: 'pending' | 'paid' | 'overdue'
  dueDate: string
}

interface ExtraCurriculum {
  id: string
  name: string
  fee: number
  description: string
}

export default function StudentDashboard() {
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [fees, setFees] = useState<Fee[]>([])
  const [extraCurriculums, setExtraCurriculums] = useState<ExtraCurriculum[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const userId = JSON.parse(localStorage.getItem('user') || '{}').id

        // Fetch attendance
        const attendanceResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/attendance/student/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const attendanceData = await attendanceResponse.json()
        setAttendance(attendanceData)

        // Fetch exams
        const examsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exams`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const examsData = await examsResponse.json()
        setExams(examsData)

        // Fetch fees
        const feesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/fees/student/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const feesData = await feesResponse.json()
        setFees(feesData)

        // Fetch extra curriculums
        const extraResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/extra-curriculum`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        const extraData = await extraResponse.json()
        setExtraCurriculums(extraData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Attendance Overview</CardTitle>
            <CardDescription>Your recent attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.slice(0, 5).map((record) => (
                <div
                  key={record.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Grade {record.class.grade} - {record.class.section}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      record.present
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {record.present ? 'Present' : 'Absent'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Your scheduled examinations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-2 border rounded space-y-2"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{exam.name}</h4>
                    <span className="text-sm">
                      {new Date(exam.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Subject: {exam.subject.name} ({exam.subject.code})
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Status</CardTitle>
            <CardDescription>Your current fee details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.map((fee) => (
                <div
                  key={fee.id}
                  className="p-2 border rounded space-y-2"
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">{formatCurrency(fee.totalAmount)}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(fee.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        fee.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : fee.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </span>
                  </div>
                  {fee.extraCurriculumFee > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Includes {formatCurrency(fee.extraCurriculumFee)} for extra activities
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Extra Curriculum Activities</CardTitle>
            <CardDescription>Available activities and enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {extraCurriculums.map((activity) => (
                <div
                  key={activity.id}
                  className="p-2 border rounded space-y-2"
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium">{activity.name}</h4>
                    <span className="text-sm font-medium">
                      {formatCurrency(activity.fee)}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
