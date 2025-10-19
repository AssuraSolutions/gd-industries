/**
 * Product feature types
 */

export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[] // Keep as string[] for flexibility
  colors: string[]
  inStock: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL'
export type ProductColor = string

export interface ProductFilters {
  categories?: string[]
  subcategories?: string[]
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  featured?: boolean
  search?: string
}

export interface ProductSortOptions {
  field: 'price' | 'name' | 'createdAt'
  order: 'asc' | 'desc'
}
