/**
 * Order feature types
 */

import type { CartItem } from '@/features/cart/types'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: CartItem[]
  total: number
  status: OrderStatus
  createdAt: Date
  updatedAt?: Date
  shippingAddress: ShippingAddress
  trackingNumber?: string
}

export interface CreateOrderInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  items: CartItem[]
  shippingAddress: ShippingAddress
}

export interface UpdateOrderStatusInput {
  orderId: string
  status: OrderStatus
  trackingNumber?: string
}
