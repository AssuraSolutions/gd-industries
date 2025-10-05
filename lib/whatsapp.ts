import type { CartItem } from "./types"

interface WhatsAppCheckoutOptions {
  phoneNumber: string
  cartItems: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export function generateWhatsAppMessage(options: WhatsAppCheckoutOptions): string {
  const { cartItems, subtotal, shipping, total } = options

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

  return message
}

export function openWhatsAppCheckout(options: WhatsAppCheckoutOptions): void {
  const message = generateWhatsAppMessage(options)
  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/${options.phoneNumber}?text=${encodedMessage}`

  window.open(whatsappUrl, "_blank")
}
