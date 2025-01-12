'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Bus {
  id: string
  number: string
  capacity: number
  driverName: string
  driverContact: string
  currentLocation?: {
    latitude: number
    longitude: number
    timestamp: string
  }
  route?: {
    name: string
    startTime: string
    endTime: string
  }
}

export default function TransportationPage() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedBus, setSelectedBus] = useState<string | null>(null)

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transportation/buses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch buses')
        }

        const data = await response.json()
        setBuses(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch buses')
      } finally {
        setLoading(false)
      }
    }

    fetchBuses()

    // Set up real-time location updates
    const locationUpdateInterval = setInterval(fetchBuses, 30000) // Update every 30 seconds

    return () => {
      clearInterval(locationUpdateInterval)
    }
  }, [])

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transportation</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Bus Routes</CardTitle>
            <CardDescription>View active bus routes and locations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {buses.map((bus) => (
                <div
                  key={bus.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Bus #{bus.number}</h4>
                      <p className="text-sm text-muted-foreground">
                        Driver: {bus.driverName}
                      </p>
                    </div>
                    {bus.route && (
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatTime(bus.route.startTime)} -{' '}
                          {formatTime(bus.route.endTime)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {bus.route.name}
                        </p>
                      </div>
                    )}
                  </div>
                  {bus.currentLocation && (
                    <div className="text-sm">
                      <p>
                        Last updated:{' '}
                        {new Date(
                          bus.currentLocation.timestamp
                        ).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    variant={selectedBus === bus.id ? 'secondary' : 'outline'}
                    onClick={() =>
                      setSelectedBus(selectedBus === bus.id ? null : bus.id)
                    }
                  >
                    {selectedBus === bus.id ? 'Hide Location' : 'Show Location'}
                  </Button>
                </div>
              ))}
              {buses.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No buses currently active
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bus Location</CardTitle>
            <CardDescription>Real-time bus tracking</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedBus ? (
              <div className="aspect-square rounded-lg border bg-muted">
                {/* Map component would go here */}
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">Map view coming soon</p>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">
                  Select a bus to view its location
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
