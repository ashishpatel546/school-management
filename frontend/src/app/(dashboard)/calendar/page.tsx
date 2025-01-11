'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  type: 'holiday' | 'exam' | 'activity' | 'other'
  isAllDay: boolean
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calendar/events`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch events')
        }

        const data = await response.json()
        setEvents(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getEventsByDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate)
      const eventEnd = new Date(event.endDate)
      return date >= eventStart && date <= eventEnd
    })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const days = []
    
    // Add padding for days from previous month
    const startPadding = firstDay.getDay()
    for (let i = 0; i < startPadding; i++) {
      const prevDate = new Date(year, month, -i)
      days.unshift(prevDate)
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }
    
    // Add padding for days from next month
    const endPadding = 42 - days.length // 6 rows * 7 days = 42
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i))
    }
    
    return days
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Calendar</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              setSelectedMonth(
                new Date(
                  selectedMonth.getFullYear(),
                  selectedMonth.getMonth() - 1
                )
              )
            }
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setSelectedMonth(
                new Date(
                  selectedMonth.getFullYear(),
                  selectedMonth.getMonth() + 1
                )
              )
            }
          >
            Next
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedMonth.toLocaleString('default', {
              month: 'long',
              year: 'numeric',
            })}
          </CardTitle>
          <CardDescription>View and manage school events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="p-2 text-center font-medium text-muted-foreground"
              >
                {day}
              </div>
            ))}
            {getDaysInMonth(selectedMonth).map((date, index) => {
              const dayEvents = getEventsByDate(date)
              const isCurrentMonth = date.getMonth() === selectedMonth.getMonth()
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border rounded-lg ${
                    isCurrentMonth ? 'bg-background' : 'bg-muted'
                  }`}
                >
                  <div className="text-sm font-medium mb-1">
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded ${
                          event.type === 'holiday'
                            ? 'bg-red-100 text-red-800'
                            : event.type === 'exam'
                            ? 'bg-yellow-100 text-yellow-800'
                            : event.type === 'activity'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>View all upcoming events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events
              .filter(
                (event) => new Date(event.startDate) >= new Date()
              )
              .sort(
                (a, b) =>
                  new Date(a.startDate).getTime() -
                  new Date(b.startDate).getTime()
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        event.type === 'holiday'
                          ? 'bg-red-100 text-red-800'
                          : event.type === 'exam'
                          ? 'bg-yellow-100 text-yellow-800'
                          : event.type === 'activity'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()} -{' '}
                    {new Date(event.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
