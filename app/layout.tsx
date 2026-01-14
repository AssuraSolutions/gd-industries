/**
 * Enhanced root layout with metadata and configuration
 */
import type React from 'react'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Suspense } from 'react'
import { defaultMetadata } from '@/config/site'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { CartProvider } from '@/components/providers/cart-provider'
import './globals.css'

export const metadata = defaultMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <CartProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
          <Sonner />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  )
}
