"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { categories, products } from "@/lib/data"

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get product count for each category
  const getCategoryProductCount = (categoryName: string) => {
    return products.filter((product) => product.category === categoryName).length
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Shop by Category</h1>
          <p className="text-muted-foreground mb-6">
            Browse our collection by category to find exactly what you're looking for
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const productCount = getCategoryProductCount(category.name)

            return (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg?height=300&width=300&query=fashion category"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm opacity-90 mb-2">{category.description}</p>
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {productCount} {productCount === 1 ? "Product" : "Products"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  )
}
