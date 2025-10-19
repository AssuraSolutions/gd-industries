/**
 * Quick Start Guide - Modern Component-Based Architecture
 */

// ============================================
// IMPORTS - How to import from the new structure
// ============================================

// 1. HOOKS
import { useCart } from '@/features/cart/hooks/use-cart'
import { useProducts, useProductSearch, useProduct } from '@/features/products/hooks/use-products'
import { useCategories } from '@/features/categories/hooks/use-categories'
import { useOffers, useOfferApplication } from '@/features/offers/hooks/use-offers'

// 2. TYPES
import type { Product, ProductFilters } from '@/features/products/types'
import type { CartItem, CartState } from '@/features/cart/types'
import type { Category } from '@/features/categories/types'
import type { Offer } from '@/features/offers/types'
import type { Order, OrderStatus } from '@/features/orders/types'

// 3. SERVICES
import { getProducts, getFeaturedProducts } from '@/services/product.service'
import { getCategories } from '@/services/category.service'
import { getActiveOffers } from '@/services/offer.service'

// 4. COMPONENTS
import { ProductCard } from '@/components/shared/product-card'
import { ProductGrid } from '@/components/shared/product-grid'
import { Section } from '@/components/shared/section'
import { EmptyCart, NoProducts } from '@/components/shared/empty-states'
import { ProductGridSkeleton } from '@/components/shared/loading-skeletons'

// 5. UTILITIES
import { formatCurrency, debounce, formatDate } from '@/lib/utils-enhanced'
import { calculateDiscountPercentage } from '@/features/products/utils'
import { calculateCartTotal } from '@/features/cart/utils'
import { isOfferValid } from '@/features/offers/utils'

// 6. CONSTANTS
import { ROUTES, CURRENCY, SHIPPING, APP_NAME } from '@/config/constants'

// ============================================
// USAGE EXAMPLES
// ============================================

// Example 1: Using Cart Hook
function CartExample() {
    const { items, total, itemCount, addItem, removeItem } = useCart()

    const handleAdd = () => {
        addItem({
            productId: '1',
            name: 'Product Name',
            price: 2500,
            image: '/image.jpg',
            size: 'M',
            color: 'Blue',
        })
    }

    return (
        <div>
            <p>Items: {itemCount}</p>
            <p>Total: {CURRENCY.symbol} {total}</p>
        </div>
    )
}

// Example 2: Using Products Hook with Filters
function ProductsExample() {
    const { products, filters, updateFilters, updateSort } = useProducts({
        initialProducts: [],
        initialFilters: { inStockOnly: true },
    })

    const handleFilter = () => {
        updateFilters({ minPrice: 1000, maxPrice: 5000 })
    }

    return <ProductGrid>{products.map(p => <ProductCard key={p.id} product={p} />)}</ProductGrid>
}

// Example 3: Server Component with Data Fetching
async function ServerComponentExample() {
    const products = await getProducts()
    const categories = await getCategories()

    return (
        <Section title="Products" description="Our latest collection">
            <ProductGrid>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ProductGrid>
        </Section>
    )
}

// Example 4: Using Utilities
function UtilityExample() {
    const price = formatCurrency(2500, 'PKR')
    const date = formatDate(new Date(), { year: 'numeric', month: 'long' })

    const debouncedSearch = debounce((query: string) => {
        console.log('Searching for:', query)
    }, 300)

    return null
}

// Example 5: Type-Safe Operations
function TypeSafeExample() {
    const product: Product = {
        id: '1',
        name: 'Product',
        description: 'Description',
        price: 2500,
        category: 'Men\'s Clothing',
        images: ['/image.jpg'],
        sizes: ['S', 'M', 'L'],
        colors: ['Blue'],
        inStock: true,
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const discount = calculateDiscountPercentage(product)
    return null
}

// ============================================
// COMMON PATTERNS
// ============================================

/*
1. DATA FETCHING (Server Components)
   - Use services: getProducts(), getCategories()
   - Use async/await
   - Add Suspense boundaries

2. CLIENT INTERACTIVITY
   - Add "use client" directive
   - Use hooks: useCart(), useProducts()
   - Optimize with memo, useMemo, useCallback

3. SHARED COMPONENTS
   - Use components from @/components/shared
   - Pass proper TypeScript types
   - Add loading/error states

4. FEATURE ORGANIZATION
   - Keep related code in feature folders
   - Export through index.ts
   - Use feature-specific types

5. CONSTANTS
   - Never hardcode values
   - Use ROUTES, CURRENCY, etc.
   - Type-safe constants
*/

export { }
