"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Tag, Package, FileText } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { generateCartPDF } from "@/lib/pdf-generator"
import { getProducts } from "@/services/product.service"
import type { Product } from "@/lib/types"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, total: subtotal } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])

  useEffect(() => {
    async function loadRecommendedProducts() {
      try {
        const response = await getProducts()
        // Get random 4 products for recommendations
        const shuffled = [...response.products].sort(() => 0.5 - Math.random())
        setRecommendedProducts(shuffled.slice(0, 4))
      } catch (error) {
        console.error("Error loading recommended products:", error)
      }
    }
    loadRecommendedProducts()
  }, [])

  const shipping = subtotal > 3000 ? 0 : 199
  const total = subtotal + shipping

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      await generateCartPDF(cartItems, { subtotal, shipping, total })
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleWhatsAppCheckout = () => {
    const phoneNumber = "923001234567" // Replace with your actual WhatsApp business number

    // Format cart items for WhatsApp message
    let message = "🛍️ *New Order from GD INDUSTRIES*\n\n"
    message += "*Order Details:*\n"
    message += "━━━━━━━━━━━━━━━━\n\n"

    cartItems.forEach((item, index) => {
      message += `${index + 1}. *${item.name}*\n`
      message += `   • Size: ${item.size}\n`
      message += `   • Color: ${item.color}\n`
      message += `   • Quantity: ${item.quantity}\n`
      message += `   • Price: Rs. ${item.price.toLocaleString()}\n`
      message += `   • Subtotal: Rs. ${(item.price * item.quantity).toLocaleString()}\n\n`
    })

    message += "━━━━━━━━━━━━━━━━\n"
    message += `*Subtotal:* Rs. ${subtotal.toLocaleString()}\n`
    message += `*Shipping:* ${shipping === 0 ? "Free" : `Rs. ${shipping}`}\n`
    message += `*Total Amount:* Rs. ${total.toLocaleString()}\n\n`
    message += "Please confirm your order and provide delivery details. 📦"

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Open WhatsApp in new tab
    window.open(whatsappUrl, "_blank")
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">Your cart is empty</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Looks like you haven't added anything to your cart yet</p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-red-700 text-white">Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900 dark:text-slate-200">Shopping Cart</span>
        </nav>

        {/* Page Title */}
        <h1 className="text-4xl font-black mb-10 tracking-tight text-slate-900 dark:text-white">Cart Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items - Left Side */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Cart Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              {/* Table Header - Hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-3 text-right">Subtotal</div>
                <div className="col-span-1"></div>
              </div>

              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}-${index}`}
                  className="grid grid-cols-12 gap-4 px-6 py-6 items-center border-b border-slate-200 dark:border-slate-800 last:border-0 hover:bg-slate-50/30 dark:hover:bg-white/5 transition-colors"
                >
                  {/* Product Details */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-4">
                    <div className="w-16 h-20 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                        {item.color && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-6 md:col-span-2 flex justify-start md:justify-center mt-4 md:mt-0">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50/30 dark:bg-slate-800/30">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-2 py-1 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold border-x border-slate-200 dark:border-slate-700 min-w-[40px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="px-2 py-1 hover:text-primary transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-5 md:col-span-3 text-right mt-4 md:mt-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Rs. {item.price.toLocaleString()} / unit
                    </p>
                  </div>

                  {/* Delete Button */}
                  <div className="col-span-1 flex justify-end mt-4 md:mt-0">
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      className="text-slate-400 hover:text-primary transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary - Right Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-slate-50/50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-lg">
              <h2 className="text-xl font-black mb-6 border-b border-slate-200 dark:border-slate-800 pb-4 text-slate-900 dark:text-white">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span className="text-sm font-medium">Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-lg font-black text-slate-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black text-primary">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {/* WhatsApp Order Button */}
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#20BD5A] hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg shadow-green-500/20 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform duration-200" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.894-5.335 11.897-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Order via WhatsApp
                </button>

                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                  className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 py-3 rounded-lg font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 hover:scale-[1.02] active:scale-[0.98] hover:border-slate-400 dark:hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                >
                  <FileText className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                  {isGeneratingPDF ? "Generating PDF..." : "Download as PDF"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Complete The Look Section */}
        {recommendedProducts.length > 0 && (
          <div className="mt-24 border-t border-slate-200 dark:border-slate-800 pt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Complete The Look</h2>
              <Link href="/products" className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                Browse New Arrivals
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group cursor-pointer"
                >
                  <div className="aspect-[3/4] rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3 relative">
                    <img
                      src={product.images?.[0] || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg"
                      }}
                    />
                    <button className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-900/90 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{product.name}</h4>
                  <p className="text-sm text-slate-500 font-medium">Rs. {product.price.toLocaleString()}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
