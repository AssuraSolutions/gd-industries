/**
 * Active Offers Section - Server Component
 */
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/shared/section'
import { getActiveOffers } from '@/services/offer.service'
import { formatOfferText, getOfferValidityText } from '@/features/offers/utils'
import { Tag } from 'lucide-react'
import { ROUTES } from '@/config/constants'

export async function ActiveOffersSection() {
  const activeOffers = await getActiveOffers()

  if (activeOffers.length === 0) {
    return null
  }

  return (
    <Section
      title="Special Offers"
      description="Don't miss out on these amazing deals!"
      className="bg-muted/20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeOffers.slice(0, 3).map((offer) => (
          <Card key={offer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{offer.title}</CardTitle>
                </div>
                <Badge variant="secondary">{formatOfferText(offer)}</Badge>
              </div>
              <CardDescription>{offer.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {getOfferValidityText(offer)}
                </span>
                {offer.minOrderValue && (
                  <span className="text-xs text-muted-foreground">
                    Min: Rs. {offer.minOrderValue}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {activeOffers.length > 3 && (
        <div className="text-center mt-8">
          <Link href={ROUTES.PRODUCTS}>
            <Button variant="outline">View All Offers</Button>
          </Link>
        </div>
      )}
    </Section>
  )
}
