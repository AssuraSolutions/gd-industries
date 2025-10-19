/**
 * Product hooks with filtering, sorting, and search
 */
'use client'

import { useState, useMemo, useCallback } from 'react'
import type { Product, ProductFilters, ProductSortOptions } from '../types'
import { filterProducts, sortProducts, calculateDiscountPercentage, isProductOnSale } from '../utils'

interface UseProductsOptions {
  initialProducts?: Product[]
  initialFilters?: ProductFilters
  initialSort?: ProductSortOptions
}

export function useProducts(options: UseProductsOptions = {}) {
  const {
    initialProducts = [],
    initialFilters = {},
    initialSort = { field: 'createdAt', order: 'desc' },
  } = options

  const [filters, setFilters] = useState<ProductFilters>(initialFilters)
  const [sortOptions, setSortOptions] = useState<ProductSortOptions>(initialSort)

  // Apply filters and sorting
  const processedProducts = useMemo(() => {
    let products = [...initialProducts]
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      products = filterProducts(products, filters)
    }
    
    // Apply sorting
    products = sortProducts(products, sortOptions)
    
    return products
  }, [initialProducts, filters, sortOptions])

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  // Clear filters
  const clearFilters = useCallback(() => {
    setFilters({})
  }, [])

  // Update sort options
  const updateSort = useCallback((newSort: Partial<ProductSortOptions>) => {
    setSortOptions((prev) => ({ ...prev, ...newSort }))
  }, [])

  return {
    products: processedProducts,
    filters,
    sortOptions,
    updateFilters,
    clearFilters,
    updateSort,
    totalCount: processedProducts.length,
  }
}

/**
 * Hook for product search functionality
 */
export function useProductSearch(products: Product[]) {
  const [searchTerm, setSearchTerm] = useState('')

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) {
      return products
    }

    return filterProducts(products, { search: searchTerm })
  }, [products, searchTerm])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchTerm('')
  }, [])

  return {
    searchTerm,
    searchResults,
    handleSearch,
    clearSearch,
    hasResults: searchResults.length > 0,
    resultCount: searchResults.length,
  }
}

/**
 * Hook for single product details with computed properties
 */
export function useProduct(product: Product | null) {
  const discountPercentage = useMemo(
    () => (product ? calculateDiscountPercentage(product) : 0),
    [product]
  )

  const onSale = useMemo(() => (product ? isProductOnSale(product) : false), [product])

  const availability = useMemo(() => {
    if (!product) {
      return { inStock: false, message: 'Product not found' }
    }
    
    return {
      inStock: product.inStock,
      message: product.inStock ? 'In Stock' : 'Out of Stock',
    }
  }, [product])

  return {
    product,
    discountPercentage,
    onSale,
    availability,
  }
}

/**
 * Hook for featured products
 */
export function useFeaturedProducts(products: Product[]) {
  const featuredProducts = useMemo(
    () => products.filter((product) => product.featured),
    [products]
  )

  return {
    featuredProducts,
    count: featuredProducts.length,
  }
}

/**
 * Hook for product price range
 */
export function usePriceRange(products: Product[]) {
  const priceRange = useMemo(() => {
    if (products.length === 0) {
      return { min: 0, max: 0 }
    }

    const prices = products.map((p) => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  }, [products])

  return priceRange
}
