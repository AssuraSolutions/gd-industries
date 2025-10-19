/**
 * Application-wide constants
 */

export const APP_NAME = 'GD Industries'
export const APP_DESCRIPTION = 'Premium Clothing Store'

export const CURRENCY = {
  symbol: 'Rs.',
  code: 'PKR',
  locale: 'en-PK',
} as const

export const SHIPPING = {
  FREE_SHIPPING_THRESHOLD: 3000,
  STANDARD_SHIPPING_COST: 200,
  EXPRESS_SHIPPING_COST: 500,
} as const

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const

export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CATEGORIES: '/categories',
  CART: '/cart',
  CONTACT: '/contact',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_SETTINGS: '/admin/settings',
} as const

export const STORAGE_KEYS = {
  CART: 'gd-cart',
  THEME: 'gd-theme',
  AUTH: 'gd-auth',
} as const

export const WHATSAPP = {
  PHONE_NUMBER: '+923001234567', // Replace with actual number
  DEFAULT_MESSAGE: 'Hello! I would like to inquire about your products.',
} as const
