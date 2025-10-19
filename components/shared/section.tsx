/**
 * Shared UI components - Section component
 */

import React, { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
    children: ReactNode
    className?: string
    containerClassName?: string
    title?: string
    description?: string
    id?: string
}

/**
 * Reusable section component for consistent page layouts
 */
export function Section({
    children,
    className,
    containerClassName,
    title,
    description,
    id,
}: SectionProps) {
    return (
        <section id={id} className={cn('py-16', className)}>
            <div className={cn('container mx-auto px-4', containerClassName)}>
                {(title || description) && (
                    <div className="text-center mb-12">
                        {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
                        {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
                    </div>
                )}
                {children}
            </div>
        </section>
    )
}
