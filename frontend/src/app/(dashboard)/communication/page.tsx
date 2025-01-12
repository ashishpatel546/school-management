'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { io, Socket } from 'socket.io-client'

interface Message {
  id: string
  content: string
  sender: {
    id: string
    firstName: string
    lastName: string
  }
  receiver: {
    id: string
    firstName: string
    lastName: string
  }
  timestamp: string
}

export default function CommunicationPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const newSocket = io(process.env.NEXT_PUBLIC_API_URL!, {
      auth: { token },
    })

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket')
    })

    newSocket.on('newMessage', (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    newSocket.on('error', (error: any) => {
      setError(error.message || 'An error occurred')
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch messages')
        }

        const data = await response.json()
        setMessages(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch messages')
      }
    }

    fetchMessages()
  }, [])

  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim() || !socket) return

    try {
      socket.emit('sendMessage', {
        recipientId: selectedUser,
        content: newMessage,
      })

      setNewMessage('')
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Communication</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Your conversations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">
                        {message.sender.firstName} {message.sender.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>New Message</CardTitle>
            <CardDescription>Send a message to someone</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button
                className="w-full"
                onClick={handleSendMessage}
                disabled={!selectedUser || !newMessage.trim()}
              >
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
