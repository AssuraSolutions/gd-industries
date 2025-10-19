/**
 * Admin StatCard component - Reusable statistics card
 */

import React, { memo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
    title: string
    value: string | number
    description?: string
    icon?: LucideIcon
    trend?: {
        value: number
        label: string
    }
    className?: string
}

/**
 * Memoized stat card for admin dashboard
 */
export const StatCard = memo<StatCardProps>(({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}) => {
    const trendIsPositive = trend && trend.value > 0

    return (
        <Card className={cn('hover:shadow-lg transition-shadow', className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">{description}</p>
                )}
                {trend && (
                    <div className="flex items-center mt-2 text-xs">
                        {trendIsPositive ? (
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        ) : (
                            <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                        )}
                        <span className={trendIsPositive ? 'text-green-500' : 'text-red-500'}>
                            {Math.abs(trend.value).toFixed(1)}%
                        </span>
                        <span className="text-muted-foreground ml-1">{trend.label}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
})

StatCard.displayName = 'StatCard'
