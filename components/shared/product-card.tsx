/**
 * Shared UI components - Enhanced Product Card with performance optimizations
 */

import React, { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import type { Product } from '@/features/products/types'
import { calculateDiscountPercentage, formatPrice } from '@/features/products/utils'
import { ShoppingCart } from 'lucide-react'

interface ProductCardProps {
    product: Product
    priority?: boolean
    onAddToCart?: (product: Product) => void
}

/**
 * Optimized Product Card component with React.memo
 */
export const ProductCard = memo<ProductCardProps>(({ product, priority = false, onAddToCart }) => {
    const discountPercentage = calculateDiscountPercentage(product)

    return (
        <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="relative aspect-[3/4] overflow-hidden">
                <Link href={`/products/${product.id}`}>
                    <Image
                        src={product.images[0] || '/placeholder.svg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        priority={priority}
                    />
                </Link>
                {discountPercentage > 0 && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs">
                        -{discountPercentage}%
                    </Badge>
                )}
                {product.featured && (
                    <Badge className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs">
                        Featured
                    </Badge>
                )}
                {!product.inStock && (
                    <Badge className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground text-xs">
                        Out of Stock
                    </Badge>
                )}
            </div>

            <CardContent className="p-3">
                <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-sm mb-1 hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-3 pt-0">
                <Link href={`/products/${product.id}`} className="w-full">
                    <Button className="w-full bg-transparent" variant="outline" size="sm">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
})

ProductCard.displayName = 'ProductCard'
