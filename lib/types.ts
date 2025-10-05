export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  images: string[]
  sizes: string[]
  colors: string[]
  inStock: boolean
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
  subcategories: string[]
  parentId?: string // For child categories
}

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface Offer {
  id: string
  title: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minOrderValue?: number
  validFrom: Date
  validTo: Date
  isActive: boolean
  applicableCategories?: string[]
}
