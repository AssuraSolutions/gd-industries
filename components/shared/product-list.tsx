import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'
import type { Product } from '@/features/products/types'

interface ProductListProps {
    products: Product[]
    totalCount: number
    onClearFilters?: () => void
    emptyMessage?: string
    emptyDescription?: string
}

export function ProductList({
    products,
    totalCount,
    onClearFilters,
    emptyMessage = 'No products found',
    emptyDescription = 'Try adjusting your search or filter criteria',
}: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
                <p className="text-muted-foreground mb-4">{emptyDescription}</p>
                {onClearFilters && (
                    <Button onClick={onClearFilters}>Clear filters</Button>
                )}
            </div>
        )
    }

    return (
        <>
            <div className="mb-6">
                <p className="text-muted-foreground">
                    Viewing {products.length} out of {totalCount} Products
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </>
    )
}
