/**
 * Categories Section - Server Component
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Section } from '@/components/shared/section'
import { getCategories } from '@/services/category.service'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { Category } from '@/features/categories/types'

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories(true) // Only parent categories
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  if (isLoading) {
    return (
      <Section
        title="Shop by Category"
        className="bg-background"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="h-full">
              <Skeleton className="aspect-[4/3] rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <Skeleton className="h-9 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  // Show 4 categories in grid, or use carousel if more than 4
  const showCarousel = categories.length > 4
  const displayCategories = showCarousel ? categories : categories.slice(0, 4)

  const CategoryCard = ({ category }: { category: Category }) => (
    <Link href={`/categories/${category.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400">{category.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {category.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {category.description ? (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {category.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">
              Explore {category.name}
            </p>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between group-hover:bg-primary/10"
          >
            Explore
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  )

  return (
    <Section
      title="Shop by Category"
      className="bg-background"
    >
      {showCarousel ? (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {displayCategories.map((category) => (
              <CarouselItem key={category.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </Section>
  )
}
