"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, ArrowRight } from "lucide-react"
import { getCategories } from "@/services/category.service"
import type { Category } from "@/features/categories/types"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories(false) // Get all categories
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [])

  const filteredCategories = categories
    .filter((category) => !category.parentId) // Only show parent categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (category.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
    )

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <div className="mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-medium mb-4 text-slate-900 dark:text-white">
            Shop by Category
          </h1>

          {/* Search Bar */}
          <div className="mt-8 flex items-center max-w-md bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1">
            <Search className="text-slate-400 mr-2 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for a specific category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow border-none bg-transparent focus:ring-0 text-sm py-2"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && filteredCategories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => {
              const isMiddle = index % 3 === 1
              
              return (
                <Link
                  key={category.id}
                  href={`/categories/${category.id}`}
                  className={`category-card relative aspect-[3/4] overflow-hidden rounded-2xl group cursor-pointer shadow-lg ${
                    isMiddle ? "md:-translate-y-8" : ""
                  }`}
                >
                  <img
                    src={category.image || `https://images.unsplash.com/photo-${
                      index % 3 === 0 ? '1617137968633-0952680c483' : 
                      index % 3 === 1 ? '1610030469983-98e550d6193c' : 
                      '1503454537195-1dcabb73ffb9'
                    }?w=600&h=800&fit=crop`}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = `https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-8 transition-transform duration-500 group-hover:-translate-y-2">
                    <h2 className="text-white text-3xl font-display mb-2">{category.name}</h2>
                    <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest font-semibold">
                      Explore Collection
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* No Results State */}
        {!isLoading && filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No categories found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search terms</p>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
