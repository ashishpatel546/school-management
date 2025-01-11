'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

interface Student {
  id: string
  firstName: string
  lastName: string
}

interface Class {
  id: string
  name: string
  grade: number
  section: string
  students: Student[]
}

const formSchema = z.object({
  classId: z.string().min(1, 'Please select a class'),
  date: z.string().min(1, 'Please select a date'),
  presentStudentIds: z.array(z.string()),
})

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<Class[]>([])
  const [error, setError] = useState('')
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: '',
      date: new Date().toISOString().split('T')[0],
      presentStudentIds: [],
    },
  })

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch classes')
        }

        const data = await response.json()
        setClasses(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch classes')
      }
    }

    fetchClasses()
  }, [])

  const onClassSelect = async (classId: string) => {
    const selectedClass = classes.find((c) => c.id === classId)
    setSelectedClass(selectedClass || null)
    form.setValue('classId', classId)
    form.setValue('presentStudentIds', [])
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/attendance/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to mark attendance')
      }

      // Reset form
      form.reset({
        classId: '',
        date: new Date().toISOString().split('T')[0],
        presentStudentIds: [],
      })
      setSelectedClass(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const toggleStudentPresence = (studentId: string) => {
    const currentIds = form.getValues('presentStudentIds')
    const newIds = currentIds.includes(studentId)
      ? currentIds.filter((id) => id !== studentId)
      : [...currentIds, studentId]
    form.setValue('presentStudentIds', newIds)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mark Attendance</CardTitle>
            <CardDescription>Select class and mark student attendance</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="classId"
                  render={() => (
                    <FormItem>
                      <FormLabel>Select Class</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border p-2"
                          onChange={(e) => onClassSelect(e.target.value)}
                          value={form.getValues('classId')}
                        >
                          <option value="">Select a class</option>
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              Grade {cls.grade} - {cls.section}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <input
                          type="date"
                          className="w-full rounded-md border p-2"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {selectedClass && (
                  <div className="space-y-2">
                    <FormLabel>Students</FormLabel>
                    {selectedClass.students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={student.id}
                          checked={form.getValues('presentStudentIds').includes(student.id)}
                          onChange={() => toggleStudentPresence(student.id)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label htmlFor={student.id}>
                          {student.firstName} {student.lastName}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Marking Attendance...' : 'Mark Attendance'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>View and manage your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View My Classes
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Attendance Records
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Exam Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
