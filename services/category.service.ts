/**
 * Category service
 */

import type { Category } from '@/features/categories/types'

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  const { categories } = await import('@/lib/data')
  return categories
}

/**
 * Fetch single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find((c) => c.id === id) || null
}

/**
 * Fetch category by name
 */
export async function getCategoryByName(name: string): Promise<Category | null> {
  const categories = await getCategories()
  return categories.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null
}
