/**
 * Admin utility functions
 */

import type { Order } from '@/features/orders/types'
import type { Product } from '@/features/products/types'
import type { AdminStats, SalesAnalytics } from '../types'

/**
 * Calculate admin dashboard statistics
 */
export function calculateAdminStats(
  products: Product[],
  orders: Order[],
  activeOffersCount: number
): AdminStats {
  const totalProducts = products.length
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const pendingOrders = orders.filter((order) => order.status === 'pending').length
  const lowStockProducts = products.filter((product) => !product.inStock).length

  return {
    totalProducts,
    totalOrders,
    totalRevenue,
    activeOffers: activeOffersCount,
    pendingOrders,
    lowStockProducts,
  }
}

/**
 * Calculate percentage change
 */
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

/**
 * Format revenue for display
 */
export function formatRevenue(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`
  }
  return amount.toLocaleString()
}

/**
 * Get order status color
 */
export function getOrderStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get recent orders
 */
export function getRecentOrders(orders: Order[], limit: number = 5): Order[] {
  return orders
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, limit)
}

/**
 * Get low stock products
 */
export function getLowStockProducts(products: Product[], limit?: number): Product[] {
  const lowStock = products.filter((product) => !product.inStock)
  return limit ? lowStock.slice(0, limit) : lowStock
}

/**
 * Calculate sales analytics
 */
export function calculateSalesAnalytics(
  orders: Order[],
  products: Product[],
  period: 'day' | 'week' | 'month' | 'year'
): SalesAnalytics {
  // Filter orders by period
  const now = new Date()
  const periodStart = new Date(now)
  
  switch (period) {
    case 'day':
      periodStart.setHours(0, 0, 0, 0)
      break
    case 'week':
      periodStart.setDate(now.getDate() - 7)
      break
    case 'month':
      periodStart.setMonth(now.getMonth() - 1)
      break
    case 'year':
      periodStart.setFullYear(now.getFullYear() - 1)
      break
  }

  const periodOrders = orders.filter((order) => order.createdAt >= periodStart)
  
  const totalSales = periodOrders.reduce((sum, order) => sum + order.total, 0)
  const orderCount = periodOrders.length
  const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0

  // Calculate top products
  const productSales = new Map<string, { revenue: number; quantity: number }>()
  
  periodOrders.forEach((order) => {
    order.items.forEach((item) => {
      const existing = productSales.get(item.productId) || { revenue: 0, quantity: 0 }
      productSales.set(item.productId, {
        revenue: existing.revenue + item.price * item.quantity,
        quantity: existing.quantity + item.quantity,
      })
    })
  })

  const topProducts = Array.from(productSales.entries())
    .map(([productId, stats]) => {
      const product = products.find((p) => p.id === productId)
      return product ? { product, ...stats } : null
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10)

  // Calculate sales by category
  const categorySales = new Map<string, { revenue: number; count: number }>()
  
  periodOrders.forEach((order) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId)
      if (product) {
        const existing = categorySales.get(product.category) || { revenue: 0, count: 0 }
        categorySales.set(product.category, {
          revenue: existing.revenue + item.price * item.quantity,
          count: existing.count + item.quantity,
        })
      }
    })
  })

  const salesByCategory = Array.from(categorySales.entries()).map(([category, stats]) => ({
    category,
    ...stats,
  }))

  return {
    period,
    totalSales,
    orderCount,
    averageOrderValue,
    topProducts,
    salesByCategory,
  }
}

/**
 * Sort table data
 */
export function sortTableData<T>(
  data: T[],
  key: keyof T,
  order: 'asc' | 'desc'
): T[] {
  return [...data].sort((a, b) => {
    const aValue = a[key]
    const bValue = b[key]

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue
    }

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (aValue instanceof Date && bValue instanceof Date) {
      return order === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }

    return 0
  })
}

/**
 * Filter orders by date range
 */
export function filterOrdersByDateRange(
  orders: Order[],
  from: Date,
  to: Date
): Order[] {
  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt)
    return orderDate >= from && orderDate <= to
  })
}

/**
 * Generate mock activity items (for demonstration)
 */
export function generateRecentActivity(orders: Order[], products: Product[]) {
  const activities: Array<{
    id: string
    type: 'order' | 'product' | 'user' | 'offer'
    action: string
    description: string
    timestamp: Date
  }> = []
  
  // Recent orders
  const recentOrders = getRecentOrders(orders, 3)
  recentOrders.forEach((order) => {
    activities.push({
      id: `order-${order.id}`,
      type: 'order' as const,
      action: 'New order received',
      description: `Order #${order.id.slice(0, 8)} - ${order.customerName}`,
      timestamp: order.createdAt,
    })
  })

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}
