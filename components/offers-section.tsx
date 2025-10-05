"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tag, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { offers } from "@/lib/data"

export function OffersSection() {
  // Get active offers
  const activeOffers = offers.filter((offer) => offer.active)

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Tag className="h-6 w-6 text-red-500" />
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">Special Offers</h2>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Don't miss out on our exclusive deals and limited-time promotions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeOffers.map((offer) => (
          <Card
            key={offer.id}
            className="relative overflow-hidden border-2 border-red-100 hover:border-red-200 transition-colors duration-300"
          >
            <div className="absolute top-4 right-4">
              <Badge className="bg-red-500 text-white">{offer.discount}</Badge>
            </div>

            <CardHeader>
              <CardTitle className="text-xl text-gray-900 pr-16">{offer.title}</CardTitle>
              <CardDescription className="text-gray-600">{offer.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Valid until {offer.validUntil}</span>
              </div>

              <Link href="/products">
                <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeOffers.length === 0 && (
        <div className="text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active offers</h3>
          <p className="text-gray-600">Check back soon for exciting deals and promotions!</p>
        </div>
      )}
    </section>
  )
}
