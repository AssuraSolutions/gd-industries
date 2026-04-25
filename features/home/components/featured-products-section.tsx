'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getFeaturedProducts } from '@/services/product.service'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react'
import type { Product } from '@/features/products/types'

export function FeaturedProductsSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -310,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 310,
        behavior: 'smooth'
      })
    }
  }

  const formatPrice = (price: number | null | undefined) => {
      return `LKR ${Number(price || 0).toLocaleString('en-LK', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      })}`;
  };

  if (isLoading) {
    return (
      <section className="py-24 bg-[#EFEFEF] dark:bg-card border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <Skeleton className="h-10 w-64" />
          </div>
          <div className="flex overflow-x-auto gap-6 pb-10">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="min-w-[250px] md:min-w-[280px]">
                <Skeleton className="aspect-[3/4] rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-[#EFEFEF] dark:bg-card border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white">
            Season's Highlights
          </h2>
          <div className="flex gap-3">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-10 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
        >
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="min-w-[250px] md:min-w-[280px] snap-center bg-white dark:bg-slate-800 rounded-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-200 dark:border-slate-700"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[1/1] overflow-hidden">
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-4 left-4 z-10 bg-primary text-white text-[10px] uppercase tracking-tighter font-bold px-2 py-1 rounded">
                      Sale -{formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                  <div className="relative w-full h-full">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 250px, 280px"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-6xl font-bold text-white/50">{product.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                    {product.description || 'Premium Quality'}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
