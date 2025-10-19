/**
 * Category hooks
 */
'use client'

import { useMemo } from 'react'
import type { Category } from '../types'
import type { Product } from '@/features/products/types'

/**
 * Hook for working with categories
 */
export function useCategories(categories: Category[]) {
  const categoryMap = useMemo(() => {
    return new Map(categories.map((cat) => [cat.id, cat]))
  }, [categories])

  const getCategoryById = (id: string): Category | undefined => {
    return categoryMap.get(id)
  }

  const getCategoryByName = (name: string): Category | undefined => {
    return categories.find((cat) => cat.name.toLowerCase() === name.toLowerCase())
  }

  return {
    categories,
    categoryMap,
    getCategoryById,
    getCategoryByName,
    count: categories.length,
  }
}

/**
 * Hook for category with products
 */
export function useCategoryWithProducts(
  categoryId: string,
  categories: Category[],
  products: Product[]
) {
  const category = useMemo(
    () => categories.find((cat) => cat.id === categoryId),
    [categories, categoryId]
  )

  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === category?.name),
    [products, category]
  )

  const subcategoryGroups = useMemo(() => {
    if (!category) return new Map()

    const groups = new Map<string, Product[]>()
    
    categoryProducts.forEach((product) => {
      const subcategory = product.subcategory || 'Other'
      const existing = groups.get(subcategory) || []
      groups.set(subcategory, [...existing, product])
    })

    return groups
  }, [category, categoryProducts])

  return {
    category,
    products: categoryProducts,
    subcategoryGroups,
    productCount: categoryProducts.length,
  }
}

/**
 * Hook for all subcategories
 */
export function useSubcategories(categories: Category[]) {
  const allSubcategories = useMemo(() => {
    const subcats = new Set<string>()
    categories.forEach((cat) => {
      cat.subcategories.forEach((sub) => subcats.add(sub))
    })
    return Array.from(subcats).sort()
  }, [categories])

  return {
    subcategories: allSubcategories,
    count: allSubcategories.length,
  }
}
