/**
 * Shared UI components - Empty states
 */

import React from 'react'
import { ShoppingBag, Search, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
    icon?: React.ReactNode
    title: string
    description?: string
    action?: {
        label: string
        href: string
    }
}

/**
 * Generic empty state component
 */
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {description && <p className="text-muted-foreground mb-6 max-w-md">{description}</p>}
            {action && (
                <Link href={action.href}>
                    <Button>{action.label}</Button>
                </Link>
            )}
        </div>
    )
}

/**
 * Empty cart state
 */
export function EmptyCart() {
    return (
        <EmptyState
            icon={<ShoppingBag className="h-16 w-16" />}
            title="Your cart is empty"
            description="Add some products to your cart to get started"
            action={{ label: 'Shop Now', href: '/products' }}
        />
    )
}

/**
 * No search results state
 */
export function NoSearchResults({ searchTerm }: { searchTerm?: string }) {
    return (
        <EmptyState
            icon={<Search className="h-16 w-16" />}
            title="No results found"
            description={
                searchTerm
                    ? `We couldn't find any products matching "${searchTerm}"`
                    : 'Try adjusting your search or filters'
            }
            action={{ label: 'View All Products', href: '/products' }}
        />
    )
}

/**
 * No products state
 */
export function NoProducts() {
    return (
        <EmptyState
            icon={<Package className="h-16 w-16" />}
            title="No products available"
            description="Check back soon for new arrivals"
            action={{ label: 'Go Home', href: '/' }}
        />
    )
}
