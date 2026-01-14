"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/providers/cart-provider"
import { getCategories } from "@/services/category.service"
import type { Category } from "@/features/categories/types"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const { itemCount } = useCart()
  const router = useRouter()

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
  }, [])

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/gd-logo.png" alt="GD Industries" width={40} height={40} className="h-10 w-10" />
            <span className="text-xl font-bold text-foreground">GD INDUSTRIES</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Products
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium hover:text-primary transition-colors p-0 h-auto">
                  Categories
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 max-h-[400px] overflow-y-auto">
                {parentCategories.map((category) => {
                  const childCategories = getChildCategories(category.id)
                  return (
                    <div key={category.id}>
                      <DropdownMenuItem asChild>
                        <Link href={`/categories/${category.id}`} className="font-medium">
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                      {childCategories.map((child) => (
                        <DropdownMenuItem key={child.id} asChild className="pl-6">
                          <Link href={`/categories/${child.id}`} className="text-muted-foreground">
                            {child.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                      {childCategories.length > 0 && <DropdownMenuSeparator />}
                    </div>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-sm mx-6">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary">
                    {itemCount}
                  </Badge>
                )}
                <span className="hidden sm:inline ml-2">Cart</span>
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <div className="px-2 py-1">
                <p className="text-sm font-medium mb-2">Categories</p>
                {parentCategories.map((category) => {
                  const childCategories = getChildCategories(category.id)
                  return (
                    <div key={category.id} className="ml-2 mb-2">
                      <Link
                        href={`/categories/${category.id}`}
                        className="block text-sm font-medium hover:text-primary transition-colors py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      {childCategories.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.id}`}
                          className="block text-xs text-muted-foreground hover:text-primary transition-colors py-1 ml-4"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )
                })}
              </div>
              <Link
                href="/contact"
                className="px-2 py-1 text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Search */}
            <div className="mt-4 px-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
