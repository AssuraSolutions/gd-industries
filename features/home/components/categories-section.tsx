/**
 * Categories Section - Server Component
 */
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Section } from '@/components/shared/section'
import { getCategories } from '@/services/category.service'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export async function CategoriesSection() {
  const categories = await getCategories()

  return (
    <Section
      title="Shop by Category"
      description="Explore our wide range of fashion categories"
      className="bg-background"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/categories/${category.id}`}>
            <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
              <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {category.description}
                </p>
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
        ))}
      </div>
    </Section>
  )
}
