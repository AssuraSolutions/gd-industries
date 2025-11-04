/**
 * Admin service - Dashboard and management operations
 */

import type { Order, OrderStatus } from '@/features/orders/types'
import type { Product } from '@/features/products/types'
import type { AdminStats } from '@/features/admin/types'
import { calculateAdminStats } from '@/features/admin/utils'

/**
 * Get all orders (admin view)
 */
export async function getAdminOrders(): Promise<Order[]> {
  const { orders } = await import('@/lib/data')
  return orders
}

/**
 * Get all products (admin view)
 */
export async function getAdminProducts(): Promise<Product[]> {
  const { products } = await import('@/lib/data')
  return products
}

/**
 * Get all offers (admin view)
 */
export async function getAdminOffers(): Promise<Offer[]> {
  const { offers } = await import('@/lib/data')
  return offers
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<AdminStats> {
  const [products, orders, offers] = await Promise.all([
    getAdminProducts(),
    getAdminOrders(),
    getAdminOffers(),
  ])

  const activeOffersCount = offers.filter((offer) => offer.isActive).length

  return calculateAdminStats(products, orders, activeOffersCount)
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual API call
  // For now, return success
  return {
    success: true,
    message: `Order ${orderId} updated to ${status}`,
  }
}

/**
 * Update product inventory
 */
export async function updateProductInventory(
  productId: string,
  inStock: boolean
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual API call
  return {
    success: true,
    message: `Product ${productId} inventory updated`,
  }
}

/**
 * Create new product
 */
export async function createProduct(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; product?: Product; message: string }> {
  // TODO: Implement actual API call
  const newProduct: Product = {
    ...product,
    id: `product-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return {
    success: true,
    product: newProduct,
    message: 'Product created successfully',
  }
}

/**
 * Update existing product
 */
export async function updateProduct(
  productId: string,
  updates: Partial<Product>
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual API call
  return {
    success: true,
    message: `Product ${productId} updated successfully`,
  }
}

/**
 * Delete product
 */
export async function deleteProduct(
  productId: string
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual API call
  return {
    success: true,
    message: `Product ${productId} deleted successfully`,
  }
}

/**
 * Create new offer
 */
export async function createOffer(
  offer: Omit<Offer, 'id'>
): Promise<{ success: boolean; offer?: Offer; message: string }> {
  // TODO: Implement actual API call
  const newOffer: Offer = {
    ...offer,
    id: `offer-${Date.now()}`,
  }

  return {
    success: true,
    offer: newOffer,
    message: 'Offer created successfully',
  }
}

/**
 * Update existing offer
 */
export async function updateOffer(
  offerId: string,
  updates: Partial<Offer>
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual API call
  return {
    success: true,
    message: `Offer ${offerId} updated successfully`,
  }
}

/**
 * Delete offer
 */
export async function deleteOffer(
  offerId: string
): Promise<{ success: boolean; message: string }> {
  // TODO: Implement actual API call
  return {
    success: true,
    message: `Offer ${offerId} deleted successfully`,
  }
}

/**
 * Get order by ID
 */
export async function getAdminOrderById(orderId: string): Promise<Order | null> {
  const orders = await getAdminOrders()
  return orders.find((order) => order.id === orderId) || null
}

/**
 * Get product by ID
 */
export async function getAdminProductById(productId: string): Promise<Product | null> {
  const products = await getAdminProducts()
  return products.find((product) => product.id === productId) || null
}

/**
 * Search products by query
 */
export async function searchAdminProducts(query: string): Promise<Product[]> {
  const products = await getAdminProducts()
  const lowercaseQuery = query.toLowerCase()

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Search orders by query
 */
export async function searchAdminOrders(query: string): Promise<Order[]> {
  const orders = await getAdminOrders()
  const lowercaseQuery = query.toLowerCase()

  return orders.filter(
    (order) =>
      order.id.toLowerCase().includes(lowercaseQuery) ||
      order.customerName.toLowerCase().includes(lowercaseQuery) ||
      order.customerEmail.toLowerCase().includes(lowercaseQuery)
  )
}
