/**
 * Admin Dashboard - Quick Actions Section
 */

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Package, Tag, Settings, FileText } from 'lucide-react'

/**
 * Quick action buttons for admin dashboard
 */
export function QuickActions() {
    const actions = [
        {
            title: 'Add Product',
            description: 'Create a new product',
            icon: Plus,
            href: '/admin/products',
            variant: 'default' as const,
        }
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {actions.map((action) => {
                        const Icon = action.icon
                        return (
                            <Link key={action.href} href={action.href}>
                                <Button
                                    variant={action.variant}
                                    className="w-full h-auto flex-col items-start p-4 space-y-2"
                                >
                                    <Icon className="h-5 w-5" />
                                    <div className="text-left">
                                        <div className="font-semibold">{action.title}</div>
                                        <div className="text-xs text-muted-foreground font-normal">
                                            {action.description}
                                        </div>
                                    </div>
                                </Button>
                            </Link>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
