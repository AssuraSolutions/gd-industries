/**
 * Admin RecentOrders component
 */

import React, { memo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Order } from '@/features/orders/types'
import { formatCurrency, formatDate } from '@/lib/utils-enhanced'
import { getOrderStatusColor } from '../utils'
import { ArrowRight } from 'lucide-react'

interface RecentOrdersProps {
    orders: Order[]
    limit?: number
}

/**
 * Display recent orders in admin dashboard
 */
export const RecentOrders = memo<RecentOrdersProps>(({ orders, limit = 5 }) => {
    const displayOrders = orders.slice(0, limit)

    if (displayOrders.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Latest customer orders</CardDescription>
                </div>
                <Link href="/admin/orders">
                    <Button variant="ghost" size="sm">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium">#{order.id.slice(0, 8)}</p>
                                    <Badge className={getOrderStatusColor(order.status)} variant="secondary">
                                        {order.status}
                                    </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{order.customerName}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(order.createdAt, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">{formatCurrency(order.total)}</p>
                                <p className="text-xs text-muted-foreground">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
})

RecentOrders.displayName = 'RecentOrders'
