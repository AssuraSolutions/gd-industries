/**
 * Enhanced cart hook with optimizations
 */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CartItem, CartState } from '../types'
import {
  calculateCartTotal,
  calculateItemCount,
  validateCartItem,
  serializeCart,
  deserializeCart,
  calculateShippingCost,
  isEligibleForFreeShipping,
  getAmountNeededForFreeShipping,
} from '../utils'
import { STORAGE_KEYS } from '@/config/constants'

export function useCart(): CartState {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART)
    if (savedCart) {
      setItems(deserializeCart(savedCart))
    }
    setIsInitialized(true)
  }, [])

  // Persist cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEYS.CART, serializeCart(items))
    }
  }, [items, isInitialized])

  // Add item to cart
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    const validation = validateCartItem(item)
    if (!validation.valid) {
      console.error('Invalid cart item:', validation.errors)
      return
    }

    setItems((prev) => {
      const existingItem = prev.find(
        (i) => i.productId === item.productId && i.size === item.size && i.color === item.color
      )

      if (existingItem) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }

      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  // Remove item from cart
  const removeItem = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size && item.color === color))
    )
  }, [])

  // Update item quantity
  const updateQuantity = useCallback((productId: string, size: string, color: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, size, color)
      return
    }

    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    )
  }, [removeItem])

  // Clear cart
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  // Memoized computed values
  const total = useMemo(() => calculateCartTotal(items), [items])
  const itemCount = useMemo(() => calculateItemCount(items), [items])
  const shippingCost = useMemo(() => calculateShippingCost(total), [total])
  const freeShippingEligible = useMemo(() => isEligibleForFreeShipping(total), [total])
  const amountForFreeShipping = useMemo(() => getAmountNeededForFreeShipping(total), [total])

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}

// Export additional hooks for specific cart operations
export function useCartSummary() {
  const { total, itemCount, items } = useCart()
  
  const shippingCost = useMemo(() => calculateShippingCost(total), [total])
  const freeShippingEligible = useMemo(() => isEligibleForFreeShipping(total), [total])
  const amountForFreeShipping = useMemo(() => getAmountNeededForFreeShipping(total), [total])
  const grandTotal = useMemo(() => total + shippingCost, [total, shippingCost])

  return {
    subtotal: total,
    shippingCost,
    grandTotal,
    itemCount,
    freeShippingEligible,
    amountForFreeShipping,
    isEmpty: items.length === 0,
  }
}
