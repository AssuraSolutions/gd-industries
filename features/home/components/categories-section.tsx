/**
 * Categories Section - Server Component
 */
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategories } from '@/services/category.service'
import { ArrowRight } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import type { Category } from '@/features/categories/types'

export function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories(true, true) // Only parent categories with product counts
        const categoriesWithProducts = data
          .filter(cat => (cat.productCount ?? 0) > 0)
          .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0))
        setCategories(categoriesWithProducts.slice(0, 3))
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
      <section className="py-24 bg-background dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <Skeleton className="h-10 w-64 mb-4" />
              <Skeleton className="h-6 w-96" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="aspect-[4/5] md:aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-background dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between mb-5">
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">
              Featured Collections
            </h2>
          </div>
          <Link 
            href="/categories" 
            className="hidden md:flex items-center text-primary font-medium hover:underline gap-1 group"
          >
            Browse Everything 
            <ArrowRight className="text-sm transition-transform group-hover:translate-x-1 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className={`group relative overflow-hidden rounded-2xl aspect-[5/6] md:aspect-[6/7] ${index === 1 ? 'md:mt-12' : ''} shadow-xl`}
            >
              <div className="relative w-full h-full">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white/50">{category.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8">
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest mb-2 block">
                  {categories[index]?.name || category.name}
                </span>
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  {categories[index]?.description || category.name}
                </h3>
                <span className="inline-flex items-center text-white text-sm opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  Shop Collection 
                  <ArrowRight className="ml-1 text-sm h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
