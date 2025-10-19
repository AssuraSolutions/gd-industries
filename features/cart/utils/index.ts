/**
 * Cart utility functions
 */

import type { CartItem, Cart } from '../types'
import { SHIPPING } from '@/config/constants'

/**
 * Calculate cart total
 */
export function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

/**
 * Calculate total item count in cart
 */
export function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0)
}

/**
 * Check if item exists in cart
 */
export function itemExistsInCart(
  items: CartItem[],
  productId: string,
  size: string,
  color: string
): boolean {
  return items.some(
    (item) => item.productId === productId && item.size === size && item.color === color
  )
}

/**
 * Find item in cart
 */
export function findCartItem(
  items: CartItem[],
  productId: string,
  size: string,
  color: string
): CartItem | undefined {
  return items.find(
    (item) => item.productId === productId && item.size === size && item.color === color
  )
}

/**
 * Calculate shipping cost
 */
export function calculateShippingCost(cartTotal: number, expressShipping: boolean = false): number {
  if (cartTotal >= SHIPPING.FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  return expressShipping ? SHIPPING.EXPRESS_SHIPPING_COST : SHIPPING.STANDARD_SHIPPING_COST
}

/**
 * Check if eligible for free shipping
 */
export function isEligibleForFreeShipping(cartTotal: number): boolean {
  return cartTotal >= SHIPPING.FREE_SHIPPING_THRESHOLD
}

/**
 * Get amount needed for free shipping
 */
export function getAmountNeededForFreeShipping(cartTotal: number): number {
  if (isEligibleForFreeShipping(cartTotal)) {
    return 0
  }
  return SHIPPING.FREE_SHIPPING_THRESHOLD - cartTotal
}

/**
 * Validate cart item
 */
export function validateCartItem(item: Omit<CartItem, 'quantity'>): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!item.productId) {
    errors.push('Product ID is required')
  }
  if (!item.name) {
    errors.push('Product name is required')
  }
  if (item.price <= 0) {
    errors.push('Invalid price')
  }
  if (!item.size) {
    errors.push('Size is required')
  }
  if (!item.color) {
    errors.push('Color is required')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Serialize cart for storage
 */
export function serializeCart(items: CartItem[]): string {
  return JSON.stringify(items)
}

/**
 * Deserialize cart from storage
 */
export function deserializeCart(data: string): CartItem[] {
  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}
