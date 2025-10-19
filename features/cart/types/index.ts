/**
 * Cart feature types
 */

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

export interface CartActions {
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
  clearCart: () => void
}

export type CartState = Cart & CartActions
