/**
 * Admin Dashboard Page - Refactored Version
 * Modern component-based architecture with Server Components
 */

import { getAdminDashboardStats, getAdminOrders } from '@/services/admin.service'
import { StatsOverview } from '@/features/admin/components/stats-overview'
import { RecentOrders } from '@/features/admin/components/recent-orders'
import { QuickActions } from '@/features/admin/components/quick-actions'
import { RecentActivity } from '@/features/admin/components/recent-activity'
import { getRecentOrders } from '@/features/admin/utils'
import type { ActivityItem } from '@/features/admin/types'

export const dynamic = 'force-dynamic'

/**
 * Generate recent activities from orders
 */
function generateRecentActivities(orders: Awaited<ReturnType<typeof getAdminOrders>>): ActivityItem[] {
    return orders.slice(0, 5).map((order, index) => ({
        id: `activity-${order.id}`,
        type: 'order' as const,
        action: 'New Order Received',
        description: `Order ${order.id} from ${order.customerName} - Rs. ${order.total.toLocaleString()}`,
        timestamp: new Date(Date.now() - index * 3600000), // Stagger timestamps
    }))
}

/**
 * Admin Dashboard Page
 */
export default async function AdminDashboardPage() {
    // Fetch data in parallel using Server Components
    const [stats, allOrders] = await Promise.all([
        getAdminDashboardStats(),
        getAdminOrders(),
    ])

    const recentOrders = getRecentOrders(allOrders, 5)
    const recentActivities = generateRecentActivities(allOrders)

    return (
        <div className="container mx-auto px-4 py-2 space-y-4">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your GD Industries
                </p>
            </div>

            {/* Statistics Overview */}
            <StatsOverview stats={stats} />

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Data Grid */}
            {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
                {/* Recent Orders */}
                {/* <RecentOrders orders={recentOrders} /> */}

                {/* Recent Activity */}
                {/* <RecentActivity activities={recentActivities} /> */}
            {/* </div> */}
        </div>
    )
}
