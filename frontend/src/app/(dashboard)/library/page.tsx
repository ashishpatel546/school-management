'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Book {
  id: string
  title: string
  author: string
  isbn: string
  copiesAvailable: number
  description: string
  publisher: string
  publishedYear: number
}

interface BookLoan {
  id: string
  book: Book
  dueDate: string
  returnDate: string | null
  isOverdue: boolean
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [loans, setLoans] = useState<BookLoan[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Fetch books
        const booksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/books`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!booksResponse.ok) {
          throw new Error('Failed to fetch books')
        }

        const booksData = await booksResponse.json()
        setBooks(booksData)

        // Fetch user's loans
        const loansResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/library/loans/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!loansResponse.ok) {
          throw new Error('Failed to fetch loans')
        }

        const loansData = await loansResponse.json()
        setLoans(loansData)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleBorrowBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/library/books/${bookId}/borrow`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to borrow book')
      }

      const loan = await response.json()
      setLoans((prev) => [...prev, loan])
      setBooks((prev) =>
        prev.map((book) =>
          book.id === bookId
            ? { ...book, copiesAvailable: book.copiesAvailable - 1 }
            : book
        )
      )
    } catch (err: any) {
      setError(err.message || 'Failed to borrow book')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Library</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Books</CardTitle>
            <CardDescription>Browse and borrow books</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{book.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        by {book.author}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">
                        {book.copiesAvailable} copies available
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{book.description}</p>
                  <Button
                    className="w-full"
                    onClick={() => handleBorrowBook(book.id)}
                    disabled={book.copiesAvailable === 0}
                  >
                    {book.copiesAvailable > 0 ? 'Borrow' : 'Not Available'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Loans</CardTitle>
            <CardDescription>Books you have borrowed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loans.map((loan) => (
                <div
                  key={loan.id}
                  className="rounded-lg border p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{loan.book.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(loan.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        loan.isOverdue
                          ? 'bg-red-100 text-red-800'
                          : loan.returnDate
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {loan.returnDate
                        ? 'Returned'
                        : loan.isOverdue
                        ? 'Overdue'
                        : 'Active'}
                    </span>
                  </div>
                </div>
              ))}
              {loans.length === 0 && (
                <p className="text-center text-muted-foreground">
                  No active loans
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
