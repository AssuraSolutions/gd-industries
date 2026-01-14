import jsPDF from "jspdf"
import type { CartItem } from "@/lib/types"

interface CartTotals {
  subtotal: number
  shipping: number
  total: number
}

export async function generateCartPDF(items: CartItem[], totals: CartTotals) {
  const doc = new jsPDF()

  // Company Header
  doc.setFontSize(20)
  doc.setTextColor(220, 38, 38) // Red color
  doc.text("GD INDUSTRIES", 105, 20, { align: "center" })

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text("Your Fashion Destination", 105, 27, { align: "center" })

  // Title
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text("Shopping Cart Summary", 105, 40, { align: "center" })

  // Date
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 47, { align: "center" })

  // Line separator
  doc.setDrawColor(200, 200, 200)
  doc.line(20, 52, 190, 52)

  let yPosition = 62

  // Products Header
  doc.setFontSize(12)
  doc.setTextColor(0, 0, 0)
  doc.text("Product Details", 20, yPosition)
  yPosition += 10

  // Table Headers
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text("Product", 20, yPosition)
  doc.text("Size", 100, yPosition)
  doc.text("Color", 125, yPosition)
  doc.text("Qty", 155, yPosition)
  doc.text("Price", 175, yPosition)

  yPosition += 5
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 7

  // Products
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)

  for (const item of items) {
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage()
      yPosition = 20
    }

    // Product name (truncate if too long)
    const productName = item.name.length > 35 ? item.name.substring(0, 32) + "..." : item.name
    doc.text(productName, 20, yPosition)
    doc.text(item.size, 100, yPosition)
    doc.text(item.color, 125, yPosition)
    doc.text(item.quantity.toString(), 155, yPosition)
    doc.text(`Rs. ${(item.price * item.quantity).toLocaleString()}`, 175, yPosition)

    yPosition += 8
  }

  // Totals section
  yPosition += 5
  doc.line(20, yPosition, 190, yPosition)
  yPosition += 10

  doc.setFontSize(10)

  // Subtotal
  doc.text("Subtotal:", 130, yPosition)
  doc.text(`Rs. ${totals.subtotal.toLocaleString()}`, 175, yPosition)
  yPosition += 7

  // Total line
  doc.setDrawColor(0, 0, 0)
  doc.line(130, yPosition, 190, yPosition)
  yPosition += 7

  // Total
  doc.setFontSize(12)
  doc.setFont(undefined, "bold")
  doc.text("Total:", 130, yPosition)
  doc.text(`Rs. ${totals.total.toLocaleString()}`, 175, yPosition)

  // Footer
  yPosition += 20
  if (yPosition > 260) {
    doc.addPage()
    yPosition = 20
  }

  doc.setFontSize(9)
  doc.setFont(undefined, "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Thank you for shopping with GD Industries!", 105, yPosition, { align: "center" })
  yPosition += 5
  doc.text("For inquiries, contact us via WhatsApp or visit our website", 105, yPosition, { align: "center" })

  // Save the PDF
  doc.save(`GD-Industries-Cart-${new Date().getTime()}.pdf`)
}
