"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Download } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { generateCartPDF } from "@/lib/pdf-generator"

export default function CartPage() {
  const { items: cartItems, updateQuantity, removeItem, total: subtotal } = useCart()
  const [promoCode, setPromoCode] = useState("")
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

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
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet</p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Shopping Cart ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-medium">Rs. {item.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                  </div>
                  {shipping === 0 && <p className="text-xs text-green-600">Free shipping on orders over Rs. 3,000</p>}
                </div>

                <Separator />

                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleDownloadPDF}
                  disabled={isGeneratingPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isGeneratingPDF ? "Generating PDF..." : "Download Cart as PDF"}
                </Button>

                <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" onClick={handleWhatsAppCheckout}>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Order Now via WhatsApp
                </Button>

                <Button className="w-full" size="lg">
                  Proceed to Checkout
                </Button>

                <div className="text-center">
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    Secure Checkout
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
