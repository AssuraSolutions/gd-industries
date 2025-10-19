/**
 * Product service - handles data fetching and business logic
 */

import type { Product, ProductFilters } from '@/features/products/types'
import { filterProducts, sortProducts } from '@/features/products/utils'

/**
 * Fetch all products
 * In a real app, this would call an API endpoint
 */
export async function getProducts(): Promise<Product[]> {
  // TODO: Replace with actual API call
  // For now, return from data file
  const { products } = await import('@/lib/data')
  return products
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) || null
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.featured)
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts()
  return products.filter((p) => p.category === category)
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getProducts()
  return filterProducts(products, { search: query })
}

/**
 * Get products with filters
 */
export async function getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
  const products = await getProducts()
  return filterProducts(products, filters)
}
