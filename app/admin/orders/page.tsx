"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Eye } from "lucide-react"
import { orders as initialOrders } from "@/lib/data"
import type { Order } from "@/lib/types"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState<Partial<Order>>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    items: [],
    total: 0,
    status: "pending",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Sri Lanka",
    },
  })

  const handleAddOrder = () => {
    const order: Order = {
      id: `ORD${Date.now()}`,
      customerName: newOrder.customerName || "",
      customerEmail: newOrder.customerEmail || "",
      customerPhone: newOrder.customerPhone || "",
      items: newOrder.items || [],
      total: newOrder.total || 0,
      status: newOrder.status || "pending",
      createdAt: new Date(),
      shippingAddress: newOrder.shippingAddress || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Sri Lanka",
      },
    }

    setOrders([...orders, order])
    setIsAddDialogOpen(false)
    setNewOrder({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      items: [],
      total: 0,
      status: "pending",
      shippingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Sri Lanka",
      },
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Order</DialogTitle>
              <DialogDescription>Manually create a new order</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={newOrder.customerName}
                  onChange={(e) => setNewOrder({ ...newOrder, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={newOrder.customerEmail}
                    onChange={(e) => setNewOrder({ ...newOrder, customerEmail: e.target.value })}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <Input
                    id="customerPhone"
                    value={newOrder.customerPhone}
                    onChange={(e) => setNewOrder({ ...newOrder, customerPhone: e.target.value })}
                    placeholder="+94 77 123 4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total">Order Total (Rs.)</Label>
                <Input
                  id="total"
                  type="number"
                  value={newOrder.total}
                  onChange={(e) => setNewOrder({ ...newOrder, total: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={newOrder.status}
                  onValueChange={(value: any) => setNewOrder({ ...newOrder, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shipping Address</Label>
                <Input
                  placeholder="Street Address"
                  value={newOrder.shippingAddress?.street}
                  onChange={(e) =>
                    setNewOrder({
                      ...newOrder,
                      shippingAddress: { ...newOrder.shippingAddress!, street: e.target.value },
                    })
                  }
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="City"
                    value={newOrder.shippingAddress?.city}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        shippingAddress: { ...newOrder.shippingAddress!, city: e.target.value },
                      })
                    }
                  />
                  <Input
                    placeholder="State"
                    value={newOrder.shippingAddress?.state}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        shippingAddress: { ...newOrder.shippingAddress!, state: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddOrder} className="bg-red-500 hover:bg-red-600">
                Add Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td className="p-4">{order.createdAt.toLocaleDateString()}</td>
                    <td className="p-4 font-medium">Rs. {order.total.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant={order.status === "delivered" ? "default" : "secondary"}>{order.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
