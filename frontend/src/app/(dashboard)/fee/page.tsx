'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'

interface Fee {
  id: string
  amount: number
  extraCurriculumFee: number
  totalAmount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue'
  paidAt?: string
  class: {
    grade: number
    section: string
  }
}

export default function FeePage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch fees')
        }

        const data = await response.json()
        setFees(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch fees')
      } finally {
        setLoading(false)
      }
    }

    fetchFees()
  }, [])

  const handleDownloadInvoice = async (feeId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/fees/${feeId}/invoice`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download invoice')
      }

      // Create a blob from the PDF stream
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${feeId}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      setError(err.message || 'Failed to download invoice')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fees</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {fees.map((fee) => (
          <Card key={fee.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    Class {fee.class.grade}-{fee.class.section} Fee
                  </CardTitle>
                  <CardDescription>
                    Due: {new Date(fee.dueDate).toLocaleDateString()}
                  </CardDescription>
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
                  {fee.status}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Base Fee</p>
                    <p className="font-medium">{formatCurrency(fee.amount)}</p>
                  </div>
                  {fee.extraCurriculumFee > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Extra Curriculum Fee
                      </p>
                      <p className="font-medium">
                        {formatCurrency(fee.extraCurriculumFee)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="font-medium">{formatCurrency(fee.totalAmount)}</p>
                  </div>
                </div>

                {fee.status === 'paid' && (
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleDownloadInvoice(fee.id)}
                  >
                    Download Invoice
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {fees.length === 0 && (
          <p className="text-center text-muted-foreground">No fees found</p>
        )}
      </div>
    </div>
  )
}
