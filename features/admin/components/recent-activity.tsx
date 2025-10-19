/**
 * Admin Dashboard - Recent Activity Section
 */

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getRelativeTime } from '@/lib/utils-enhanced'
import { Package, ShoppingCart, Tag, User } from 'lucide-react'
import type { ActivityItem } from '@/features/admin/types'

interface RecentActivityProps {
    activities: ActivityItem[]
    limit?: number
}

const activityIcons = {
    order: ShoppingCart,
    product: Package,
    offer: Tag,
    user: User,
}

/**
 * Display recent admin activities
 */
export function RecentActivity({ activities, limit = 10 }: RecentActivityProps) {
    const displayActivities = activities.slice(0, limit)

    if (displayActivities.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No recent activity
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activities</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayActivities.map((activity) => {
                        const Icon = activityIcons[activity.type]
                        return (
                            <div key={activity.id} className="flex items-start gap-4">
                                <div className="p-2 rounded-full bg-muted">
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium">{activity.action}</p>
                                        <Badge variant="outline" className="text-xs">
                                            {activity.type}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {getRelativeTime(activity.timestamp)}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
