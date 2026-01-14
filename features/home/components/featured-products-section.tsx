'use client'

import { useEffect, useState } from 'react'
import { Section } from '@/components/shared/section'
import { ProductCard } from '@/components/shared/product-card'
import { ProductGrid } from '@/components/shared/product-grid'
import { getFeaturedProducts } from '@/services/product.service'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import type { Product } from '@/features/products/types'

export function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const products = await getFeaturedProducts()
        setFeaturedProducts(products)
      } catch (error) {
        console.error('Failed to load featured products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  if (isLoading) {
    return (
      <Section title="Featured Products" className="bg-background">
        <ProductGrid>
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </ProductGrid>
      </Section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  const showCarousel = featuredProducts.length > 4

  return (
    <Section title="Featured Products" className="bg-background">
      {showCarousel ? (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {featuredProducts.map((product, index) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <ProductCard product={product} priority={index < 4} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      ) : (
        <ProductGrid>
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </ProductGrid>
      )}
    </Section>
  )
}
