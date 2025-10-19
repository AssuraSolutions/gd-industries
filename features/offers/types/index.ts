/**
 * Offer feature types
 */

export type DiscountType = 'percentage' | 'fixed'

export interface Offer {
  id: string
  title: string
  description: string
  discountType: DiscountType
  discountValue: number
  minOrderValue?: number
  validFrom: Date
  validTo: Date
  isActive: boolean
  applicableCategories?: string[]
  code?: string
}

export interface ApplyOfferInput {
  offerId: string
  orderTotal: number
  categories?: string[]
}

export interface OfferResult {
  applicable: boolean
  discountAmount: number
  finalAmount: number
  message?: string
}
