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
        </div>
    )
}
