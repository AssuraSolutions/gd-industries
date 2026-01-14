/**
 * Product service - handles data fetching and business logic
 */

import type { Product, ProductFilters } from '@/features/products/types'
import { filterProducts, sortProducts } from '@/features/products/utils'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export interface ProductQueryParams {
  categoryId?: string
  search?: string
  sortBy?: string
  availability?: 'all' | 'in-stock' | 'out-of-stock'
  featured?: boolean
  limit?: number
  page?: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

/**
 * Fetch all products from API with optional filters and pagination
 */
export async function getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams()

    if (params?.categoryId && params.categoryId !== 'all') {
      queryParams.append('categoryId', params.categoryId)
    }

    if (params?.search) {
      queryParams.append('search', params.search)
    }

    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy)
    }

    if (params?.availability && params.availability !== 'all') {
      queryParams.append('availability', params.availability)
    }

    if (params?.featured) {
      queryParams.append('featured', 'true')
    }

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString())
    }

    if (params?.page) {
      queryParams.append('page', params.page.toString())
    }

    const url = `${API_BASE_URL}/api/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await response.json()
    return {
      products: data.products || [],
      total: data.total || 0,
      page: data.page || 1,
      pageSize: data.pageSize || 0,
      hasMore: data.hasMore || false,
    }
  } catch (error) {
    console.error('Error in getProducts:', error)
    return {
      products: [],
      total: 0,
      page: 1,
      pageSize: 0,
      hasMore: false,
    }
  }
}

/**
 * Fetch single product by ID or slug
 */
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.product || null
  } catch (error) {
    console.error('Error in getProductById:', error)
    return null
  }
}

/**
 * Fetch featured products from API
 */
export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products/featured`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch featured products')
    }

    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error)
    return []
  }
}

/**
 * Fetch products by category ID
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products?categoryId=${categoryId}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products by category')
    }

    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error in getProductsByCategory:', error)
    return []
  }
}

/**
 * Search products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(query)}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to search products')
    }

    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error in searchProducts:', error)
    return []
  }
}

/**
 * Get products with filters
 * Note: For complex filters, we fetch all and filter client-side
 * In production, you might want to move this logic to the API
 */
export async function getFilteredProducts(filters: ProductFilters): Promise<Product[]> {
  try {
    let url = `${API_BASE_URL}/api/products?`
    
    // Map categories to first category if exists
    if (filters.categories && filters.categories.length > 0) {
      url += `categoryId=${filters.categories[0]}&`
    }
    
    if (filters.inStockOnly) {
      url += `inStock=true&`
    }
    
    if (filters.featured) {
      url += `featured=true&`
    }
    
    if (filters.search) {
      url += `search=${encodeURIComponent(filters.search)}&`
    }

    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch filtered products')
    }

    const data = await response.json()
    let products = data.products || []

    // Apply client-side filters for complex filtering
    products = filterProducts(products, filters)

    return products
  } catch (error) {
    console.error('Error in getFilteredProducts:', error)
    return []
  }
}
