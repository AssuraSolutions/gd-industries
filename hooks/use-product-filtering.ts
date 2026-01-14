import { useState, useMemo } from 'react'
import type { Product } from '@/features/products/types'

export type SortOption = 'name' | 'price-low' | 'price-high' | 'newest'

interface UseProductFilteringProps {
  products: Product[]
  initialSort?: SortOption
}

export function useProductFiltering({
  products,
  initialSort = 'name',
}: UseProductFilteringProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>(initialSort)

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      // Search filter
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())

      return matchesSearch
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [products, searchQuery, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSortBy('name')
  }

  const hasActiveFilters = searchQuery !== ''

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filteredProducts,
    clearFilters,
    hasActiveFilters,
  }
}
