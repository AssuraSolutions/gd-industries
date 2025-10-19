/**
 * Offer service
 */

import type { Offer } from '@/features/offers/types'
import { isOfferValid } from '@/features/offers/utils'

/**
 * Fetch all offers
 */
export async function getOffers(): Promise<Offer[]> {
  const { offers } = await import('@/lib/data')
  return offers
}

/**
 * Fetch active offers
 */
export async function getActiveOffers(): Promise<Offer[]> {
  const offers = await getOffers()
  return offers.filter((offer) => isOfferValid(offer))
}

/**
 * Fetch offer by ID
 */
export async function getOfferById(id: string): Promise<Offer | null> {
  const offers = await getOffers()
  return offers.find((o) => o.id === id) || null
}

/**
 * Fetch offer by code
 */
export async function getOfferByCode(code: string): Promise<Offer | null> {
  const offers = await getOffers()
  return offers.find((o) => o.code?.toLowerCase() === code.toLowerCase() && isOfferValid(o)) || null
}
