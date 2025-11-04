/**
 * Admin feature types
 */

import type { Order, OrderStatus } from '@/features/orders/types'
import type { Product } from '@/features/products/types'

/**
 * Admin dashboard statistics
 */
export interface AdminStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
  revenueChange?: number // percentage
  ordersChange?: number // percentage
}

/**
 * Admin user/authentication
 */
export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'super-admin' | 'manager'
  lastLogin?: Date
}

/**
 * Admin authentication state
 */
export interface AdminAuthState {
  isAuthenticated: boolean
  user: AdminUser | null
  loading: boolean
}

/**
 * Recent activity item
 */
export interface ActivityItem {
  id: string
  type: 'order' | 'product' | 'user'
  action: string
  description: string
  timestamp: Date
  metadata?: Record<string, any>
}

/**
 * Product inventory update
 */
export interface InventoryUpdate {
  productId: string
  inStock: boolean
  quantity?: number
  reason?: string
}

/**
 * Order status update
 */
export interface OrderStatusUpdate {
  orderId: string
  status: OrderStatus
  trackingNumber?: string
  notes?: string
}

/**
 * Admin dashboard filters
 */
export interface DashboardFilters {
  dateRange: {
    from: Date
    to: Date
  }
  status?: OrderStatus[]
  category?: string[]
}

/**
 * Sales analytics
 */
export interface SalesAnalytics {
  period: 'day' | 'week' | 'month' | 'year'
  totalSales: number
  orderCount: number
  averageOrderValue: number
  topProducts: Array<{
    product: Product
    revenue: number
    quantity: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    count: number
  }>
}

/**
 * Admin table column definition
 */
export interface TableColumn<T = any> {
  key: keyof T | string
  header: string
  sortable?: boolean
  width?: string
  render?: (value: any, item: T) => React.ReactNode
}

/**
 * Admin table pagination
 */
export interface TablePagination {
  page: number
  pageSize: number
  total: number
}

/**
 * Admin notification
 */
export interface AdminNotification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  timestamp: Date
  actionUrl?: string
}
