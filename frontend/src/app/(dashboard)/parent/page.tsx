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
  status: 'pending' | 'paid' | 'overdue'
  dueDate: string
  student: {
    id: string
    firstName: string
    lastName: string
  }
  class: {
    name: string
    grade: number
    section: string
  }
}

export default function ParentDashboard() {
  const [fees, setFees] = useState<Fee[]>([])
  const [error, setError] = useState('')
  const [paymentProcessing, setPaymentProcessing] = useState(false)

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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch fees')
      }
    }

    fetchFees()
  }, [])

  const handlePayFee = async (feeId: string, amount: number) => {
    try {
      setPaymentProcessing(true)
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/fees/${feeId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      // Update the fees list
      setFees((prevFees) =>
        prevFees.map((fee) =>
          fee.id === feeId ? { ...fee, status: 'paid' } : fee
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setPaymentProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Parent Dashboard</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Fee Payments</CardTitle>
            <CardDescription>View and pay student fees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fees.map((fee) => (
                <div
                  key={fee.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {fee.student.firstName} {fee.student.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Grade {fee.class.grade} - {fee.class.section}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(fee.totalAmount)}</p>
                      <p className="text-sm text-muted-foreground">Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm">
                      Base Fee: {formatCurrency(fee.amount)}
                    </p>
                    {fee.extraCurriculumFee > 0 && (
                      <p className="text-sm">
                        Extra Curriculum: {formatCurrency(fee.extraCurriculumFee)}
                      </p>
                    )}
                  </div>
                  {fee.status === 'pending' && (
                    <Button
                      className="w-full"
                      onClick={() => handlePayFee(fee.id, fee.totalAmount)}
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing ? 'Processing...' : 'Pay Now'}
                    </Button>
                  )}
                  {fee.status === 'paid' && (
                    <p className="text-center text-sm text-green-600 font-medium">
                      Paid
                    </p>
                  )}
                  {fee.status === 'overdue' && (
                    <div className="space-y-2">
                      <p className="text-center text-sm text-red-600 font-medium">
                        Overdue
                      </p>
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => handlePayFee(fee.id, fee.totalAmount)}
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? 'Processing...' : 'Pay Now (Overdue)'}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {fees.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No fees to display
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>View student information and activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Student Details
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Attendance Records
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                View Exam Schedule
              </Button>
              <Button className="w-full" variant="outline" onClick={() => {}}>
                Extra Curriculum Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
