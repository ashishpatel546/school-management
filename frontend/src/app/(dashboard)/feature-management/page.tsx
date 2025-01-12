'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface Feature {
  id: string
  name: string
  isEnabled: boolean
  description: string | null
}

export default function FeatureManagementPage() {
  const [features, setFeatures] = useState<Feature[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/features`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch features')
        }

        const data = await response.json()
        setFeatures(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch features')
      } finally {
        setLoading(false)
      }
    }

    fetchFeatures()
  }, [])

  const handleToggleFeature = async (featureId: string, isEnabled: boolean) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/features/${featureId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isEnabled }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update feature')
      }

      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
          feature.id === featureId ? { ...feature, isEnabled } : feature
        )
      )
    } catch (err: any) {
      setError(err.message || 'Failed to update feature')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Feature Management</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {features.map((feature) => (
          <Card key={feature.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id={`feature-${feature.id}`}
                    checked={feature.isEnabled}
                    onCheckedChange={(checked) =>
                      handleToggleFeature(feature.id, checked)
                    }
                  />
                  <Label htmlFor={`feature-${feature.id}`}>
                    {feature.isEnabled ? 'Enabled' : 'Disabled'}
                  </Label>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
