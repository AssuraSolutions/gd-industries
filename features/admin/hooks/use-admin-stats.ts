/**
 * Admin hooks - Dashboard statistics and management
 */
'use client'

import { useMemo, useState, useCallback } from 'react'
import type { Order } from '@/features/orders/types'
import type { Product } from '@/features/products/types'
import type { AdminStats, DashboardFilters, SalesAnalytics } from '../types'
import {
  calculateAdminStats,
  calculateSalesAnalytics,
  getRecentOrders,
  getLowStockProducts,
  filterOrdersByDateRange,
  sortTableData,
} from '../utils'

interface UseAdminStatsOptions {
  products: Product[]
  orders: Order[]
  activeOffersCount: number
}

/**
 * Hook for admin dashboard statistics
 */
export function useAdminStats({ products, orders, activeOffersCount }: UseAdminStatsOptions) {
  const stats = useMemo(
    () => calculateAdminStats(products, orders, activeOffersCount),
    [products, orders, activeOffersCount]
  )

  const recentOrders = useMemo(() => getRecentOrders(orders, 5), [orders])

  const lowStockProducts = useMemo(() => getLowStockProducts(products, 5), [products])

  return {
    stats,
    recentOrders,
    lowStockProducts,
  }
}

/**
 * Hook for sales analytics
 */
export function useSalesAnalytics(products: Product[], orders: Order[]) {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month')

  const analytics = useMemo(
    () => calculateSalesAnalytics(orders, products, period),
    [orders, products, period]
  )

  const changePeriod = useCallback((newPeriod: typeof period) => {
    setPeriod(newPeriod)
  }, [])

  return {
    analytics,
    period,
    changePeriod,
  }
}

/**
 * Hook for admin dashboard filters
 */
export function useAdminFilters(orders: Order[]) {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateRange: {
      from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      to: new Date(),
    },
  })

  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    // Apply date range filter
    filtered = filterOrdersByDateRange(filtered, filters.dateRange.from, filters.dateRange.to)

    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((order) => filters.status?.includes(order.status))
    }

    return filtered
  }, [orders, filters])

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: {
        from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        to: new Date(),
      },
    })
  }, [])

  return {
    filters,
    filteredOrders,
    updateFilters,
    resetFilters,
  }
}

/**
 * Hook for admin table management
 */
export function useAdminTable<T>(data: T[]) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return sortTableData(data, sortKey, sortOrder)
  }, [data, sortKey, sortOrder])

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize
    const end = start + pageSize
    return sortedData.slice(start, end)
  }, [sortedData, page, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = useCallback((key: keyof T) => {
    setSortKey((prev) => {
      if (prev === key) {
        setSortOrder((order) => (order === 'asc' ? 'desc' : 'asc'))
        return key
      }
      setSortOrder('asc')
      return key
    })
  }, [])

  const handlePageChange = useCallback((newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)))
  }, [totalPages])

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
  }, [])

  return {
    data: paginatedData,
    sortKey,
    sortOrder,
    page,
    pageSize,
    totalPages,
    totalItems: sortedData.length,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  }
}
