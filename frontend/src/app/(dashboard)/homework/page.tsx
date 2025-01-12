'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  totalMarks: number
  subject: {
    name: string
    code: string
  }
  teacher: {
    firstName: string
    lastName: string
  }
  submission?: {
    id: string
    content: string
    submittedAt: string
    marks?: number
    teacherFeedback?: string
    isGraded: boolean
  }
}

export default function HomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submissionContent, setSubmissionContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/homework/assignments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch assignments')
        }

        const data = await response.json()
        setAssignments(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch assignments')
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  const handleSubmitAssignment = async (assignmentId: string) => {
    try {
      setSubmitting(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/homework/assignments/${assignmentId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: submissionContent }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit assignment')
      }

      const submission = await response.json()
      setAssignments((prev) =>
        prev.map((assignment) =>
          assignment.id === assignmentId
            ? { ...assignment, submission }
            : assignment
        )
      )
      setSubmissionContent('')
    } catch (err: any) {
      setError(err.message || 'Failed to submit assignment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Homework</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>
                    {assignment.subject.name} ({assignment.subject.code})
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Marks: {assignment.totalMarks}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose prose-sm">
                  <p>{assignment.description}</p>
                </div>

                {assignment.submission ? (
                  <div className="space-y-2">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-semibold mb-2">Your Submission</h4>
                      <p className="text-sm mb-2">{assignment.submission.content}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted: {new Date(assignment.submission.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    {assignment.submission.isGraded && (
                      <div className="rounded-lg border p-4 space-y-2">
                        <div className="flex justify-between">
                          <h4 className="font-semibold">Grade</h4>
                          <p className="font-medium">
                            {assignment.submission.marks} / {assignment.totalMarks}
                          </p>
                        </div>
                        {assignment.submission.teacherFeedback && (
                          <div>
                            <h4 className="font-semibold">Feedback</h4>
                            <p className="text-sm">
                              {assignment.submission.teacherFeedback}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={submissionContent}
                      onChange={(e) => setSubmissionContent(e.target.value)}
                    />
                    <Button
                      className="w-full"
                      onClick={() => handleSubmitAssignment(assignment.id)}
                      disabled={!submissionContent.trim() || submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {assignments.length === 0 && (
          <p className="text-center text-muted-foreground">
            No assignments available
          </p>
        )}
      </div>
    </div>
  )
}
