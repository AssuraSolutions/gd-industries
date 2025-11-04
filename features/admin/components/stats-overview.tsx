/**
 * Admin Dashboard - Stats Overview Section
 */

import React from 'react'
import { Package, ShoppingCart, DollarSign, Tag, AlertCircle, TrendingUp } from 'lucide-react'
import { StatCard } from '@/features/admin/components/stat-card'
import { formatRevenue } from '@/features/admin/utils'
import type { AdminStats } from '@/features/admin/types'

interface StatsOverviewProps {
    stats: AdminStats
}

/**
 * Dashboard statistics overview section
 */
export function StatsOverview({ stats }: StatsOverviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Total Products"
                value={stats.totalProducts}
                description="Active inventory items"
                icon={Package}
                trend={
                    stats.revenueChange
                        ? {
                            value: stats.revenueChange,
                            label: 'from last month',
                        }
                        : undefined
                }
            />

            <StatCard
                title="Total Orders"
                value={stats.totalOrders}
                description="Customer orders received"
                icon={ShoppingCart}
                trend={
                    stats.ordersChange
                        ? {
                            value: stats.ordersChange,
                            label: 'from last month',
                        }
                        : undefined
                }
            />

            <StatCard
                title="Total Revenue"
                value={`Rs. ${formatRevenue(stats.totalRevenue)}`}
                description="Lifetime earnings"
                icon={DollarSign}
            />

            {stats.pendingOrders > 0 && (
                <StatCard
                    title="Pending Orders"
                    value={stats.pendingOrders}
                    description="Awaiting processing"
                    icon={AlertCircle}
                    className="border-yellow-200 dark:border-yellow-800"
                />
            )}

            {stats.lowStockProducts > 0 && (
                <StatCard
                    title="Low Stock"
                    value={stats.lowStockProducts}
                    description="Products out of stock"
                    icon={TrendingUp}
                    className="border-red-200 dark:border-red-800"
                />
            )}
        </div>
    )
}
