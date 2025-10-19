/**
 * Product utility functions
 */

import type { Product, ProductFilters, ProductSortOptions } from '../types'

/**
 * Calculate discount percentage for a product
 */
export function calculateDiscountPercentage(product: Product): number {
  if (!product.originalPrice || product.originalPrice <= product.price) {
    return 0
  }
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}

/**
 * Check if a product is on sale
 */
export function isProductOnSale(product: Product): boolean {
  return !!product.originalPrice && product.originalPrice > product.price
}

/**
 * Filter products based on criteria
 */
export function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    // Category filter
    if (filters.categories?.length && !filters.categories.includes(product.category)) {
      return false
    }

    // Subcategory filter
    if (filters.subcategories?.length && !filters.subcategories.includes(product.subcategory || '')) {
      return false
    }

    // Price range filter
    if (filters.minPrice !== undefined && product.price < filters.minPrice) {
      return false
    }
    if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
      return false
    }

    // Stock filter
    if (filters.inStockOnly && !product.inStock) {
      return false
    }

    // Featured filter
    if (filters.featured !== undefined && product.featured !== filters.featured) {
      return false
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesName = product.name.toLowerCase().includes(searchLower)
      const matchesDescription = product.description.toLowerCase().includes(searchLower)
      const matchesCategory = product.category.toLowerCase().includes(searchLower)
      if (!matchesName && !matchesDescription && !matchesCategory) {
        return false
      }
    }

    return true
  })
}

/**
 * Sort products based on options
 */
export function sortProducts(products: Product[], options: ProductSortOptions): Product[] {
  const sorted = [...products]
  
  sorted.sort((a, b) => {
    let comparison = 0
    
    switch (options.field) {
      case 'price':
        comparison = a.price - b.price
        break
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'createdAt':
        comparison = a.createdAt.getTime() - b.createdAt.getTime()
        break
    }
    
    return options.order === 'asc' ? comparison : -comparison
  })
  
  return sorted
}

/**
 * Format product price with currency
 */
export function formatPrice(price: number, currencySymbol: string = 'Rs.'): string {
  return `${currencySymbol} ${price.toLocaleString()}`
}

/**
 * Get product availability status
 */
export function getAvailabilityStatus(product: Product): {
  available: boolean
  message: string
  variant: 'default' | 'destructive' | 'warning'
} {
  if (!product.inStock) {
    return {
      available: false,
      message: 'Out of Stock',
      variant: 'destructive',
    }
  }
  
  return {
    available: true,
    message: 'In Stock',
    variant: 'default',
  }
}
