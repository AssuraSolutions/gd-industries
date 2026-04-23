"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Search, ShoppingCart, Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/providers/cart-provider"
import { getCategories } from "@/services/category.service"
import type { Category } from "@/features/categories/types"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [activeParent, setActiveParent] = useState<string | null>(null)
  const { itemCount } = useCart()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories(false) // Get all categories including children
        setCategories(data)
      } catch (error) {
        console.error('Failed to load categories:', error)
      }
    }

    loadCategories()
    
    // Check for dark mode preference
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark')
    setIsDarkMode(!isDarkMode)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  // Memoize category organization to prevent recalculation on every render
  const { parentCategories, categoryMap } = useMemo(() => {
    const parents = categories.filter(cat => !cat.parentId)
    const childMap = new Map<string, Category[]>()

    categories.forEach(cat => {
      if (cat.parentId) {
        if (!childMap.has(cat.parentId)) {
          childMap.set(cat.parentId, [])
        }
        childMap.get(cat.parentId)!.push(cat)
      }
    })

    return {
      parentCategories: parents,
      categoryMap: childMap
    }
  }, [categories])

  const getChildCategories = (parentId: string) => categoryMap.get(parentId) || []

  return (
    <nav className="sticky top-0 z-50 bg-[#F4F4F4]/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-3">
            <div className="flex items-center gap-4">
              <Image src="/images/gd-logo.png" alt="GD Industries" width={40} height={40} className="rounded" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">GD INDUSTRIES</h1>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link 
              href="/" 
              className={`font-medium transition-colors ${
                pathname === '/' 
                  ? 'text-primary' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className={`font-medium transition-colors ${
                pathname === '/products' 
                  ? 'text-primary' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
              }`}
            >
              Products
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsMegaOpen((v) => !v)}
                className={`flex items-center gap-1 font-medium transition-colors outline-none ${
                  pathname?.startsWith("/categories") || isMegaOpen
                    ? "text-primary"
                    : "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                Categories
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMegaOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
            <Link 
              href="/contact" 
              className={`font-medium transition-colors ${
                pathname === '/contact' 
                  ? 'text-primary' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Actions (Search, Cart, Dark Mode) */}
          <div className="flex items-center space-x-6">
            {/* Desktop Search */}
            <div className="hidden lg:block relative w-64">
              <form onSubmit={handleSearch}>
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-full leading-5 bg-white/50 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                />
              </form>
            </div>

            {/* Cart */}
            <Link href="/cart" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Dark Mode Toggle */}
            {/* <button 
              onClick={toggleDarkMode}
              className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button> */}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-600 dark:text-slate-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className={`px-2 py-2 text-sm font-medium transition-colors ${
                  pathname === '/' 
                    ? 'text-primary' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className={`px-2 py-2 text-sm font-medium transition-colors ${
                  pathname === '/products' 
                    ? 'text-primary' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <div className="px-2 py-2">
                <p className={`text-sm font-medium mb-3 ${
                  pathname?.startsWith('/categories') 
                    ? 'text-primary' 
                    : 'text-slate-900 dark:text-white'
                }`}>Categories</p>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 space-y-1">
                  {parentCategories.map((category) => {
                    const childCategories = getChildCategories(category.id)
                    return (
                      <div key={category.id} className="mb-1">
                        <Link
                          href={`/categories/${category.id}`}
                          className="block text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-white hover:bg-primary hover:shadow-md hover:scale-[1.02] transition-all py-2 px-3 rounded-lg"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {category.name}
                        </Link>
                        {childCategories.length > 0 && (
                          <div className="ml-4 mt-1 space-y-1">
                            {childCategories.map((child) => (
                              <Link
                                key={child.id}
                                href={`/categories/${child.id}`}
                                className="block text-xs text-slate-600 dark:text-slate-400 hover:text-white hover:bg-primary/90 hover:pl-4 transition-all py-1.5 px-3 rounded-lg"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <Link
                href="/contact"
                className={`px-2 py-2 text-sm font-medium transition-colors ${
                  pathname === '/contact' 
                    ? 'text-primary' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Search */}
            <div className="mt-4 px-2">
              <form onSubmit={handleSearch} className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </span>
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                />
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {isMegaOpen && (
        <div
          className="fixed inset-0 top-20 bg-black/20 z-40"
          onClick={() => setIsMegaOpen(false)}
        />
      )}

      {/* Mega Menu Panel */}
      <div
        className={`absolute left-0 right-0 top-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 transition-all duration-200 ${
          isMegaOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex py-8 gap-0">

            {/* Left sidebar — parent categories */}
            <div className="w-56 flex-shrink-0 border-r border-slate-100 dark:border-slate-800">
              {parentCategories.map((category) => (
                <button
                  key={category.id}
                  onMouseEnter={() => setActiveParent(category.id)}
                  onClick={() => {
                    router.push(`/categories/${category.id}`)
                    setIsMegaOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 mr-4 text-sm font-medium rounded-lg transition-all text-left ${
                    activeParent === category.id
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{category.name}</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </button>
              ))}
            </div>

            {/* Right panel — children + featured card */}
            <div className="flex-1 pl-8">
              {parentCategories.map((category) => {
                const children = getChildCategories(category.id)
                return (
                  <div
                    key={category.id}
                    className={activeParent === category.id ? "block" : "hidden"}
                  >
                    <div className="grid grid-cols-3 gap-x-8">
                      {/* Child links — span 2 cols */}
                      <div className="col-span-2">
                        <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-3">
                          {category.name}
                        </p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                          {children.map((child) => (
                            <Link
                              key={child.id}
                              href={`/categories/${child.id}`}
                              onClick={() => setIsMegaOpen(false)}
                              className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 py-2 rounded-md transition-all"
                            >
                              {child.name}
                            </Link>
                          ))}
                          <Link
                            href={`/categories/${category.id}`}
                            onClick={() => setIsMegaOpen(false)}
                            className="text-sm font-medium text-primary px-2 py-2 col-span-2"
                          >
                            View all in {category.name} →
                          </Link>
                        </div>
                      </div>

                      {/* Featured card */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 flex flex-col gap-2 self-start">
                        <span className="text-xs font-medium tracking-widest uppercase text-slate-400">
                          Featured
                        </span>
                        <p className="text-base font-semibold text-slate-900 dark:text-white">
                          {category.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          Browse our full range of {category.name.toLowerCase()} products from leading manufacturers.
                        </p>
                        <Link
                          href={`/categories/${category.id}`}
                          onClick={() => setIsMegaOpen(false)}
                          className="text-xs font-medium text-primary mt-1"
                        >
                          Shop now →
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer quick links */}
          <div className="flex gap-6 py-3.5 border-t border-slate-100 dark:border-slate-800">
            <Link href="/products" onClick={() => setIsMegaOpen(false)} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              View all products
            </Link>
            <Link href="/products?sort=new" onClick={() => setIsMegaOpen(false)} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              New arrivals
            </Link>
            <Link href="/products?sort=popular" onClick={() => setIsMegaOpen(false)} className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              Best sellers
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
