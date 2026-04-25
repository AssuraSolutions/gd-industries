"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { getProductById, getProducts } from "@/services/product.service"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/lib/toast"
import { 
  ShoppingCart,
  Share2, 
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus
} from "lucide-react"
import type { Product } from "@/features/products/types"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRelated, setIsLoadingRelated] = useState(false)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("details")
  const { addItem } = useCart()

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(params.id)
        if (!data) {
          notFound()
        }
        setProduct(data)
        
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0])
        }
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0])
        }
      } catch (error) {
        console.error('Failed to load product:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  // Load related products based on category
  useEffect(() => {
    async function loadRelatedProducts() {
      if (!product) return

      setIsLoadingRelated(true)
      try {
        const categoryId = typeof product.category === 'object' ? (product.category as any).id : product.category
        if (!categoryId) {
          setIsLoadingRelated(false)
          return
        }

        const response = await getProducts()
        // Filter products by same category, excluding current product
        const related = response.products.filter((p: Product) => {
          const pCategoryId = typeof p.category === 'object' ? (p.category as any).id : p.category
          return pCategoryId === categoryId && p.id !== product.id
        }).slice(0, 8)

        setRelatedProducts(related)
      } catch (error) {
        console.error('Failed to load related products:', error)
      } finally {
        setIsLoadingRelated(false)
      }
    }

    loadRelatedProducts()
  }, [product])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
      })
    }

    toast.success("Added to cart", `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`)
  }

  const formatPrice = (price: number | null | undefined) => {
      return `LKR ${Number(price || 0).toLocaleString('en-LK', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
      })}`;
  };

  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out ${product.name}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-background dark:bg-background border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="flex text-sm text-slate-500 dark:text-slate-400">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="hover:text-primary dark:hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-1" />
                  {product && product.category ? (
                    <Link href="/categories" className="hover:text-primary dark:hover:text-primary transition">
                      {typeof product.category === 'object' ? (product.category as any).name : product.category}
                    </Link>
                  ) : (
                    <Link href="/products" className="hover:text-primary dark:hover:text-primary transition">
                      Products
                    </Link>
                  )}
                </div>
              </li>
              {product && (
                <li aria-current="page">
                  <div className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1" />
                    <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
                  </div>
                </li>
              )}
            </ol>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Mobile Back Button */}
        <div className="md:hidden mb-4">
          <Link 
            href="/products"
            className="inline-flex items-center text-primary font-medium text-sm hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        {isLoading ? (
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            <Skeleton className="h-[600px] rounded-2xl" />
            <div className="space-y-6 mt-10 lg:mt-0">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        ) : !product ? (
          notFound()
        ) : (
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              {/* Thumbnail Sidebar */}
              <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:w-24 flex-shrink-0 no-scrollbar">
                {(product.images && product.images.length > 0 ? product.images : ['/placeholder.jpg']).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[3/4] rounded-lg overflow-hidden border-2 transition flex-shrink-0 w-20 lg:w-full ${
                      selectedImage === index
                        ? 'border-primary ring-2 ring-primary ring-opacity-50'
                        : 'border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className={`w-full h-full object-cover transition ${
                        selectedImage === index ? '' : 'opacity-80 hover:opacity-100'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.jpg'
                      }}
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1">
                <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#EFEDE6] dark:bg-slate-800 relative group shadow-sm">
                  <img
                    src={(product.images && product.images.length > 0 ? product.images[selectedImage] : '/placeholder.jpg') || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.jpg'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mt-10 px-2 sm:px-0 lg:mt-0">
              {/* Header */}
              <div className="mt-2 flex items-center gap-2">
                  <Badge className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.inStock 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200'
                  }`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              <div className="mb-6">
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">
                  {product.name}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {product.category 
                    ? `${typeof product.category === 'object' ? (product.category as any).name : product.category} Collection` 
                    : 'Premium Collection'} • Item #{product.sku}
                </p>
              </div>

              {/* Price */}
              <div className="mb-4 border-b border-slate-200 dark:border-slate-700 pb-8">
                <div className="flex items-end gap-3">
                  <p className="text-xl font-bold text-primary">{formatPrice(product.price)}</p>
                  {product.originalPrice && (
                    <>
                      <p className="text-lg text-slate-500 line-through mb-1">
                        {formatPrice(product.originalPrice)}
                      </p>
                      <Badge className="text-sm font-medium text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded mb-1.5">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              {/* Options Form */}
              <form className="space-y-6">
                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">Color</h3>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <select
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="block w-full pl-3 pr-10 py-3 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-background dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm appearance-none cursor-pointer"
                      >
                        {product.colors.map((color) => (
                          <option key={color} value={color}>{color}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <ChevronRight className="h-5 w-5 rotate-90" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-white">Size</h3>
                    </div>
                    <div className="relative w-full sm:w-64">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="block w-full pl-3 pr-10 py-3 text-base border-slate-300 dark:border-slate-600 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-background dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm appearance-none cursor-pointer"
                      >
                        {product.sizes && product.sizes.length > 0 && (
                          product.sizes.map((size) => (
                            <option key={size} value={size}>{size}</option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        <ChevronRight className="h-5 w-5 rotate-90" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 mt-8">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg w-max bg-background dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-3 text-slate-600 dark:text-slate-400 hover:text-primary focus:outline-none disabled:opacity-50"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-12 text-center border-none p-0 text-slate-900 dark:text-white bg-transparent focus:ring-0 text-sm font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-3 text-slate-600 dark:text-slate-400 hover:text-primary focus:outline-none"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <Button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 bg-primary hover:bg-red-600 text-white rounded-lg py-6 px-8 flex items-center justify-center text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  {/* Share */}
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex-shrink-0 bg-background dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg p-3 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-primary hover:border-primary dark:hover:text-primary dark:hover:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Product Details Tabs */}
        {product && (
          <section className="mt-10 pt-10 border-t border-slate-200 dark:border-slate-700">
            <div className="border-b border-slate-200 dark:border-slate-700">
              <nav aria-label="Tabs" className="-mb-px flex space-x-8 overflow-x-auto no-scrollbar">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'details'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  Product Details
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'specifications'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  Specifications
                </button>
              </nav>
            </div>

            <div className="py-8 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              {activeTab === 'details' && (
                <>
                  <p className="mb-4">
                    {product.description}
                  </p>
                </>
              )}
              {activeTab === 'specifications' && (
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-900 dark:text-white">SKU:</span>
                    <span>{product.sku}</span>
                  </div>
                  {product.category && (
                    <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-medium text-slate-900 dark:text-white">Category:</span>
                      <span>{typeof product.category === 'object' ? (product.category as any).name : product.category}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-900 dark:text-white">Available Colors:</span>
                    <span>{product.colors?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-medium text-slate-900 dark:text-white">Available Sizes:</span>
                    <span>{product.sizes?.join(', ')}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-8">You Might Also Like</h2>

            {isLoadingRelated ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="space-y-3">
                    <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.slice(0, 4).map((relatedProduct) => (
                  <a
                    key={relatedProduct.id}
                    href={`/products/${relatedProduct.id}`}
                    className="group block"
                  >
                    <div className="aspect-[1/1] w-full rounded-lg overflow-hidden bg-[#EFEDE6] dark:bg-slate-800 mb-3 relative">
                      <img
                        src={(relatedProduct.images && relatedProduct.images[0]) || '/placeholder.jpg'}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover transition duration-300 group-hover:opacity-90"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.jpg'
                        }}
                      />
                    </div>
                    <h3 className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mb-1 group-hover:text-primary transition line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {typeof relatedProduct.category === 'object' ? (relatedProduct.category as any).name : relatedProduct.category || 'Collection'}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-base sm:text-sm font-bold text-primary">{formatPrice(relatedProduct.price)}</p>
                      {relatedProduct.originalPrice && (
                        <p className="text-xs sm:text-sm text-slate-500 line-through">
                          {formatPrice(relatedProduct.originalPrice)}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
