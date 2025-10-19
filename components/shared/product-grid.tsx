/**
 * Shared UI components - Product Grid
 */

import React, { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ProductGridProps {
    children: ReactNode
    className?: string
    columns?: {
        default?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
    }
}

/**
 * Responsive product grid component
 */
export function ProductGrid({ children, className, columns }: ProductGridProps) {
    const {
        default: defaultCols = 1,
        sm = 2,
        md = 3,
        lg = 4,
        xl = 4,
    } = columns || {}

    const gridClass = cn(
        'grid gap-6',
        `grid-cols-${defaultCols}`,
        `sm:grid-cols-${sm}`,
        `md:grid-cols-${md}`,
        `lg:grid-cols-${lg}`,
        `xl:grid-cols-${xl}`,
        className
    )

    return <div className={gridClass}>{children}</div>
}
