"use client"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { getCategoryById, getCategoryProducts } from "@/services/category.service"
import { getCategories } from "@/services/category.service"
import Link from "next/link"
import type { Category } from "@/features/categories/types"
import type { Product } from "@/features/products/types"

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string

  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [availabilityExpanded, setAvailabilityExpanded] = useState(true)
  const [categoriesExpanded, setCategoriesExpanded] = useState(false)
  const [sortExpanded, setSortExpanded] = useState(false)
  
  const productsPerPage = 20

  // Load category info
  useEffect(() => {
    async function loadCategory() {
      try {
        const categoryData = await getCategoryById(categoryId)
        if (!categoryData) {
          notFound()
        }
        setCategory(categoryData)
        setSelectedCategories([categoryId]) // Auto-select the current category
      } catch (error) {
        console.error('Failed to load category:', error)
        notFound()
      }
    }
    loadCategory()
  }, [categoryId])

  // Load all categories once for filter
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

  // Load products
  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true)
      try {
        const productsData = await getCategoryProducts(categoryId)
        
        // Apply filters
        let filteredProducts = productsData
        
        // Filter by stock
        if (inStockOnly) {
          filteredProducts = filteredProducts.filter((p: Product) => p.inStock)
        }
        
        // Filter by selected categories (if different from current category)
        if (selectedCategories.length > 0 && !selectedCategories.includes(categoryId)) {
          filteredProducts = filteredProducts.filter((p: Product) => {
            const productCategoryId = typeof p.category === 'object' ? (p.category as any).id : p.category
            return selectedCategories.includes(productCategoryId)
          })
        }
        
        // Sort products
        filteredProducts = [...filteredProducts].sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price
            case 'price-high':
              return b.price - a.price
            case 'newest':
              return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            case 'popular':
              return (b.views || 0) - (a.views || 0)
            default:
              return 0
          }
        })
        
        setProducts(filteredProducts)
      } catch (error) {
        console.error('Failed to load products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    if (category) {
      loadProducts()
    }
  }, [categoryId, category, selectedCategories, sortBy, inStockOnly])

  const handleCategoryToggle = (categoryIdToToggle: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryIdToToggle) 
        ? prev.filter(id => id !== categoryIdToToggle)
        : [...prev, categoryIdToToggle]
    )
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedCategories([categoryId]) // Reset to current category
    setInStockOnly(false)
    setSortBy("newest")
    setCurrentPage(1)
  }

  // Group categories by parent
  const parentCategories = categories.filter(c => !c.parentId)
  const getCategoryChildren = (parentId: string) => {
    return categories.filter(c => c.parentId === parentId)
  }

  const totalProducts = products.length
  const totalPages = Math.ceil(totalProducts / productsPerPage)
  const paginatedProducts = products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage)
  const displayedStart = totalProducts > 0 ? (currentPage - 1) * productsPerPage + 1 : 0
  const displayedEnd = Math.min(currentPage * productsPerPage, totalProducts)

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`
  }

  if (isLoading || !category) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-10 w-64 mb-4" />

          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <aside className="w-full lg:w-72">
              <Skeleton className="h-96" />
            </aside>
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="aspect-[3/4] rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-slate-400">/</span>
          <span className="font-medium text-slate-900 dark:text-white">{category.name}</span>
        </div>

        {/* Category Header */}
        <h1 className="text-3xl font-display font-bold mb-2 text-slate-900 dark:text-white">{category.name}</h1>
        {category.description && (
          <p className="text-slate-600 dark:text-slate-400">{category.description}</p>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-xl text-slate-900 dark:text-white">Filters</h2>
                <button 
                  onClick={handleClearFilters}
                  className="text-primary text-xs font-semibold uppercase tracking-wider hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="mt-4">
                {/* Availability Filter */}
                <div className="border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setAvailabilityExpanded(!availabilityExpanded)}
                    className="flex items-center justify-between w-full py-4 text-sm font-medium text-slate-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Availability
                    <span className="material-symbols-outlined text-lg">
                      {availabilityExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {availabilityExpanded && (
                    <div className="pb-4 space-y-3">
                      <label className="flex items-center text-sm text-slate-700 dark:text-slate-300 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => {
                            setInStockOnly(e.target.checked)
                            setCurrentPage(1)
                          }}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-colors cursor-pointer mr-3"
                        />
                        <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">In Stock</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* Categories Filter */}
                <div className="border-t border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                    className="flex items-center justify-between w-full py-4 text-sm font-medium text-slate-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Categories
                    <span className="material-symbols-outlined text-lg">
                      {categoriesExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {categoriesExpanded && (
                    <div className="pb-4 space-y-4">
                      {parentCategories.map((parentCategory) => {
                        const children = getCategoryChildren(parentCategory.id)
                        return (
                          <div key={parentCategory.id} className="space-y-3">
                            <label className="flex items-center text-sm font-medium text-slate-900 dark:text-white cursor-pointer group">
                              <input 
                                type="checkbox"
                                checked={selectedCategories.includes(parentCategory.id)}
                                onChange={() => handleCategoryToggle(parentCategory.id)}
                                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-colors cursor-pointer mr-3"
                              />
                              <span className="hover:underline">{parentCategory.name}</span>
                            </label>
                            {children.length > 0 && (
                              <div className="pl-7 space-y-3">
                                {children.map((child) => (
                                  <label key={child.id} className="flex items-center text-sm text-slate-600 dark:text-slate-400 cursor-pointer group">
                                    <input 
                                      type="checkbox"
                                      checked={selectedCategories.includes(child.id)}
                                      onChange={() => handleCategoryToggle(child.id)}
                                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-colors cursor-pointer mr-3"
                                    />
                                    <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{child.name}</span>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Sort By Filter */}
                <div className="border-t border-b border-slate-200 dark:border-slate-800">
                  <button 
                    onClick={() => setSortExpanded(!sortExpanded)}
                    className="flex items-center justify-between w-full py-4 text-sm font-medium text-slate-900 dark:text-white hover:text-primary transition-colors"
                  >
                    Sort By: {sortBy === 'newest' ? 'Newest' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Popular'}
                    <span className="material-symbols-outlined text-lg">
                      {sortExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                  {sortExpanded && (
                    <div className="pb-4 space-y-3">
                      {['newest', 'price-low', 'price-high', 'popular'].map((option) => (
                        <label key={option} className="flex items-center text-sm text-slate-700 dark:text-slate-300 cursor-pointer group">
                          <input 
                            type="radio"
                            name="sort"
                            checked={sortBy === option}
                            onChange={() => {
                              setSortBy(option)
                              setCurrentPage(1)
                            }}
                            className="w-4 h-4 border-slate-300 dark:border-slate-700 text-primary focus:ring-primary transition-colors cursor-pointer mr-3"
                          />
                          <span className="group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                            {option === 'newest' ? 'Newest First' : option === 'price-low' ? 'Price: Low to High' : option === 'price-high' ? 'Price: High to Low' : 'Most Popular'}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Count */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Viewing <span className="font-semibold text-slate-900 dark:text-slate-100">{displayedStart}</span>-<span className="font-semibold text-slate-900 dark:text-slate-100">{displayedEnd}</span> out of <span className="font-semibold text-slate-900 dark:text-slate-100">{totalProducts}</span> Products
              </p>
            </div>

            {/* Products Grid or Empty State */}
            {paginatedProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-slate-500 dark:text-slate-400 mb-4">No products found</p>
                <button
                  onClick={handleClearFilters}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {paginatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="product-card group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden aspect-[3/4]">
                        <img
                          src={(product.images && product.images[0]) || '/placeholder.jpg'}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.jpg'
                          }}
                        />
                        
                        {product.originalPrice && (
                          <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors text-slate-900 dark:text-white">
                          {product.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                          {product.description || 'Premium quality product'}
                        </p>
                        <div className="flex items-center justify-between">
                          {product.originalPrice ? (
                            <div className="flex flex-col">
                              <span className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                              <span className="text-xs text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
                            </div>
                          ) : (
                            <span className="text-xl font-bold text-slate-900 dark:text-white">{formatPrice(product.price)}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }
                        
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="px-2 text-slate-400">...</span>
                          <button
                            onClick={() => setCurrentPage(totalPages)}
                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-colors"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
