"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductFilters } from "@/components/shared/product-filters"
import { ProductList } from "@/components/shared/product-list"
import { getProducts } from "@/services/product.service"
import { getCategories } from "@/services/category.service"
import type { Product } from "@/features/products/types"
import type { Category } from "@/features/categories/types"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [availability, setAvailability] = useState<"all" | "in-stock" | "out-of-stock">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const pageSize = 50

  // Load categories once
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await getCategories(false)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Load products with filters - triggers on filter changes
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        const response = await getProducts({
          categoryId: selectedCategory,
          search: searchQuery || undefined,
          sortBy,
          availability,
          limit: pageSize,
          page,
        })
        
        setProducts(response.products)
        setTotalCount(response.total)
        setHasMore(response.hasMore)
      } catch (error) {
        console.error('Failed to load products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory, availability, searchQuery, sortBy, page])

  // Set initial search query from URL params
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search')
    if (urlSearchQuery) {
      setSearchQuery(urlSearchQuery)
    }
  }, [searchParams])

  const handleLoadMore = () => {
    setPage(prev => prev + 1)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSortBy("newest")
    setSelectedCategory("all")
    setAvailability("all")
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-8" />

          <div className="mb-8 space-y-4">
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-10 flex-1 min-w-[200px]" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>

          <Skeleton className="h-6 w-48 mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">Discover our complete collection of premium clothing and accessories</p>
        </div>

        {/* Filters */}
        <ProductFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
          showCategoryFilter
          categoryId={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
        />

        {/* Additional Filters (Availability) */}
        {(selectedCategory !== "all" || availability !== "all") && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategory !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory("all")}>
                Category: {categories.find(c => c.id === selectedCategory)?.name || selectedCategory} ×
              </Badge>
            )}
            {availability !== "all" && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setAvailability("all")}>
                Availability: {availability === "in-stock" ? "In Stock" : "Out of Stock"} ×
              </Badge>
            )}
          </div>
        )}

        {/* Products List */}
        <ProductList
          products={products}
          totalCount={totalCount}
          onClearFilters={handleClearFilters}
        />

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={handleLoadMore}
              size="lg"
              variant="outline"
              className="min-w-[200px]"
            >
              Load More ({totalCount - products.length} more)
            </Button>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
