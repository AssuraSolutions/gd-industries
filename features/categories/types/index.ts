/**
 * Category feature types
 */

export interface Category {
  id: string
  name: string
  description: string
  image: string
  subcategories: string[]
  parentId?: string
  slug?: string
  productCount?: number
}

export interface CategoryWithProducts extends Category {
  products: Array<{ id: string; name: string; image: string; price: number }>
}
