/**
 * Hero Section - Server Component
 */
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import { ROUTES, APP_NAME } from '@/config/constants'

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 geometric-pattern">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Welcome to {APP_NAME}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Fashion That Defines
              <span className="text-primary"> Your Style</span>
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Discover our premium collection of clothing and accessories. Quality craftsmanship
              meets modern design for the discerning customer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button size="lg" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href={ROUTES.CATEGORIES}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 triangle-pattern">
              <Image
                src="/fashion-clothing-store-hero-image.jpg"
                alt={`${APP_NAME} Fashion`}
                width={600}
                height={600}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
