/**
 * Category service
 */

import type { Category } from '@/features/categories/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

/**
 * Fetch all categories from API
 * By default, only fetches top-level parent categories
 */
export async function getCategories(parentOnly: boolean = true): Promise<Category[]> {
  try {
    const url = `${API_BASE_URL}/api/categories${parentOnly ? '?parentOnly=true' : ''}`
    const response = await fetch(url, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    const data = await response.json()
    return data.categories || []
  } catch (error) {
    console.error('Error in getCategories:', error)
    return []
  }
}

/**
 * Fetch single category by ID or slug
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.category || null
  } catch (error) {
    console.error('Error in getCategoryById:', error)
    return null
  }
}

/**
 * Fetch category by name
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
  try {
    const categories = await getCategories(false) // Get all categories
    return categories.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null
  } catch (error) {
    console.error('Error in getCategoryByName:', error)
    return null
  }
}

/**
 * Fetch all parent categories (top-level only)
 */
export async function getParentCategories(): Promise<Category[]> {
  return getCategories(true)
}

/**
 * Fetch all categories including subcategories
 */
export async function getAllCategories(): Promise<Category[]> {
  return getCategories(false)
}

/**
 * Fetch products for a category including child categories
 */
export async function getCategoryProducts(categoryId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/products`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch category products')
    }

    return await response.json()
  } catch (error) {
    console.error('Error in getCategoryProducts:', error)
    return []
  }
}
