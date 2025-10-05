"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Left Content */}
          <div className="flex flex-col justify-center py-12 lg:py-20 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full w-fit text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              New Collection 2024
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-balance">
                Elevate Your
                <span className="block text-red-500">Style</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-md text-pretty">
                Discover premium fashion that defines your unique personality. Quality meets affordability.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white h-12 px-8">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent">
                  Explore Categories
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-muted-foreground">Premium Products</div>
              </div>
            </div>
          </div>

          {/* Right Image Grid */}
          <div className="relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full p-4 lg:p-8">
              <div className="space-y-4">
                <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden">
                  <Image
                    src="/modern-fashion-clothing-store-display.jpg"
                    alt="Fashion Collection"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden">
                  <Image src="/cotton-t-shirt.jpg" alt="Cotton T-Shirt" fill className="object-cover" />
                </div>
              </div>
              <div className="space-y-4 pt-8 lg:pt-16">
                <div className="relative h-48 lg:h-64 rounded-2xl overflow-hidden">
                  <Image src="/classic-denim-jacket.png" alt="Denim Jacket" fill className="object-cover" />
                </div>
                <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-red-500 to-blue-600 flex items-center justify-center text-white p-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">50%</div>
                    <div className="text-lg">OFF</div>
                    <div className="text-sm mt-2">Selected Items</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
