/**
 * Offer utility functions
 */

import type { Offer, ApplyOfferInput, OfferResult } from '../types'

/**
 * Check if offer is currently valid
 */
export function isOfferValid(offer: Offer, currentDate: Date = new Date()): boolean {
  if (!offer.isActive) {
    return false
  }

  const validFrom = new Date(offer.validFrom)
  const validTo = new Date(offer.validTo)

  return currentDate >= validFrom && currentDate <= validTo
}

/**
 * Calculate discount amount from offer
 */
export function calculateDiscountAmount(offer: Offer, orderTotal: number): number {
  if (offer.discountType === 'percentage') {
    return (orderTotal * offer.discountValue) / 100
  }
  return offer.discountValue
}

/**
 * Apply offer to order
 */
export function applyOffer(input: ApplyOfferInput, offer: Offer): OfferResult {
  // Check if offer is valid
  if (!isOfferValid(offer)) {
    return {
      applicable: false,
      discountAmount: 0,
      finalAmount: input.orderTotal,
      message: 'This offer is no longer valid',
    }
  }

  // Check minimum order value
  if (offer.minOrderValue && input.orderTotal < offer.minOrderValue) {
    return {
      applicable: false,
      discountAmount: 0,
      finalAmount: input.orderTotal,
      message: `Minimum order value of Rs. ${offer.minOrderValue} required`,
    }
  }

  // Check applicable categories
  if (offer.applicableCategories && offer.applicableCategories.length > 0) {
    const hasApplicableCategory = input.categories?.some((cat) =>
      offer.applicableCategories?.includes(cat)
    )
    
    if (!hasApplicableCategory) {
      return {
        applicable: false,
        discountAmount: 0,
        finalAmount: input.orderTotal,
        message: 'This offer is not applicable to your cart items',
      }
    }
  }

  // Calculate discount
  const discountAmount = calculateDiscountAmount(offer, input.orderTotal)
  const finalAmount = Math.max(0, input.orderTotal - discountAmount)

  return {
    applicable: true,
    discountAmount,
    finalAmount,
    message: `${offer.title} applied successfully`,
  }
}

/**
 * Get best offer for order
 */
export function getBestOffer(offers: Offer[], orderTotal: number, categories?: string[]): Offer | null {
  const applicableOffers = offers.filter((offer) => {
    const result = applyOffer({ offerId: offer.id, orderTotal, categories }, offer)
    return result.applicable
  })

  if (applicableOffers.length === 0) {
    return null
  }

  // Return offer with highest discount
  return applicableOffers.reduce((best, current) => {
    const bestDiscount = calculateDiscountAmount(best, orderTotal)
    const currentDiscount = calculateDiscountAmount(current, orderTotal)
    return currentDiscount > bestDiscount ? current : best
  })
}

/**
 * Format offer display text
 */
export function formatOfferText(offer: Offer): string {
  if (offer.discountType === 'percentage') {
    return `${offer.discountValue}% OFF`
  }
  return `Rs. ${offer.discountValue} OFF`
}

/**
 * Get offer validity text
 */
export function getOfferValidityText(offer: Offer): string {
  const validTo = new Date(offer.validTo)
  const now = new Date()
  const daysLeft = Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

  if (daysLeft < 0) {
    return 'Expired'
  } else if (daysLeft === 0) {
    return 'Expires today'
  } else if (daysLeft === 1) {
    return 'Expires tomorrow'
  } else if (daysLeft <= 7) {
    return `${daysLeft} days left`
  }

  return `Valid until ${validTo.toLocaleDateString()}`
}
