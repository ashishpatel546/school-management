'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
}

interface Order {
  id: string
  items: {
    menuItem: MenuItem
    quantity: number
  }[]
  totalAmount: number
  status: 'pending' | 'confirmed' | 'ready' | 'delivered'
  orderDate: string
}

export default function CafeteriaPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [cart, setCart] = useState<{ menuItem: MenuItem; quantity: number }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Fetch menu items
        const menuResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafeteria/menu`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!menuResponse.ok) {
          throw new Error('Failed to fetch menu')
        }

        const menuData = await menuResponse.json()
        setMenuItems(menuData)

        // Fetch orders
        const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafeteria/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!ordersResponse.ok) {
          throw new Error('Failed to fetch orders')
        }

        const ordersData = await ordersResponse.json()
        setOrders(ordersData)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddToCart = (menuItem: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.menuItem.id === menuItem.id
      )
      if (existingItem) {
        return prevCart.map((item) =>
          item.menuItem.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { menuItem, quantity: 1 }]
    })
  }

  const handleRemoveFromCart = (menuItemId: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.menuItem.id === menuItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Not authenticated')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cafeteria/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            menuItemId: item.menuItem.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const order = await response.json()
      setOrders((prev) => [order, ...prev])
      setCart([])
    } catch (err: any) {
      setError(err.message || 'Failed to place order')
    }
  }

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.menuItem.price * item.quantity,
      0
    )
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Cafeteria</h1>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
            <CardDescription>Available items for order</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {menuItems
                .filter((item) => item.isAvailable)
                .map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cart</CardTitle>
              <CardDescription>Review your order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.menuItem.id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{item.menuItem.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(item.menuItem.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.menuItem.id)}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCart(item.menuItem)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                ))}
                {cart.length > 0 ? (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">
                        {formatCurrency(calculateTotal())}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </Button>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Your cart is empty
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">
                          Order #{order.id.slice(0, 8)}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.orderDate).toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'ready'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-sm">
                          {item.quantity}x {item.menuItem.name}
                        </p>
                      ))}
                    </div>
                    <p className="text-sm font-medium">
                      Total: {formatCurrency(order.totalAmount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
