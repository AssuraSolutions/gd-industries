/**
 * Shared UI components - Loading states
 */

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

/**
 * Product card skeleton loader
 */
export function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden h-full">
            <Skeleton className="aspect-[3/4] w-full" />
            <CardContent className="p-3">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
            <CardFooter className="p-3 pt-0">
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    )
}

/**
 * Product grid skeleton loader
 */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    )
}

/**
 * Page section skeleton loader
 */
export function SectionSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
        </div>
    )
}
