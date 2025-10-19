/**
 * Offer hooks
 */
'use client'

import { useMemo, useCallback } from 'react'
import type { Offer } from '../types'
import {
  isOfferValid,
  applyOffer,
  getBestOffer,
  formatOfferText,
  getOfferValidityText,
} from '../utils'

/**
 * Hook for working with offers
 */
export function useOffers(offers: Offer[]) {
  const activeOffers = useMemo(
    () => offers.filter((offer) => isOfferValid(offer)),
    [offers]
  )

  const getOfferById = useCallback(
    (id: string) => offers.find((offer) => offer.id === id),
    [offers]
  )

  return {
    allOffers: offers,
    activeOffers,
    getOfferById,
    activeCount: activeOffers.length,
    totalCount: offers.length,
  }
}

/**
 * Hook for applying offer to cart
 */
export function useOfferApplication(
  offers: Offer[],
  orderTotal: number,
  categories?: string[]
) {
  const bestOffer = useMemo(
    () => getBestOffer(offers, orderTotal, categories),
    [offers, orderTotal, categories]
  )

  const applyBestOffer = useCallback(() => {
    if (!bestOffer) {
      return {
        applicable: false,
        discountAmount: 0,
        finalAmount: orderTotal,
        message: 'No applicable offers',
      }
    }

    return applyOffer({ offerId: bestOffer.id, orderTotal, categories }, bestOffer)
  }, [bestOffer, orderTotal, categories])

  const applySpecificOffer = useCallback(
    (offerId: string) => {
      const offer = offers.find((o) => o.id === offerId)
      if (!offer) {
        return {
          applicable: false,
          discountAmount: 0,
          finalAmount: orderTotal,
          message: 'Offer not found',
        }
      }

      return applyOffer({ offerId, orderTotal, categories }, offer)
    },
    [offers, orderTotal, categories]
  )

  return {
    bestOffer,
    applyBestOffer,
    applySpecificOffer,
    hasBestOffer: !!bestOffer,
  }
}

/**
 * Hook for offer display information
 */
export function useOfferDisplay(offer: Offer) {
  const displayText = useMemo(() => formatOfferText(offer), [offer])
  const validityText = useMemo(() => getOfferValidityText(offer), [offer])
  const isValid = useMemo(() => isOfferValid(offer), [offer])

  return {
    displayText,
    validityText,
    isValid,
  }
}
