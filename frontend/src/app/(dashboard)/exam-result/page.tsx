'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ExamResult {
  id: string
  exam: {
    name: string
    date: string
  }
  subject: {
    name: string
    code: string
  }
  marksObtained: number
  totalMarks: number
  percentage: number
  rank?: number
  teacherRemarks?: string
  class: {
    grade: number
    section: string
  }
}

export default function ExamResultPage() {
  const [results, setResults] = useState<ExamResult[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/exam-results`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch exam results')
        }

        const data = await response.json()
        setResults(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch exam results')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  const handleDownloadResult = async (resultId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/exam-results/${resultId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download result')
      }

      // Create a blob from the PDF stream
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `result-${resultId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to download result')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Exam Results</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {results.map((result) => (
          <Card key={result.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{result.exam.name}</CardTitle>
                  <CardDescription>
                    Class {result.class.grade}-{result.class.section}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {new Date(result.exam.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.subject.name} ({result.subject.code})
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Marks Obtained</p>
                    <p className="font-medium">
                      {result.marksObtained} / {result.totalMarks}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Percentage</p>
                    <p className="font-medium">{result.percentage}%</p>
                  </div>
                  {result.rank && (
                    <div>
                      <p className="text-sm text-muted-foreground">Rank</p>
                      <p className="font-medium">{result.rank}</p>
                    </div>
                  )}
                </div>

                {result.teacherRemarks && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teacher Remarks</p>
                    <p className="text-sm">{result.teacherRemarks}</p>
                  </div>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleDownloadResult(result.id)}
                >
                  Download Result
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {results.length === 0 && (
          <p className="text-center text-muted-foreground">No exam results found</p>
        )}
      </div>
    </div>
  )
}
