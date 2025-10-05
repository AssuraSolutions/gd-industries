import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/images/gd-logo.png" alt="GD Industries" width={32} height={32} className="h-8 w-8" />
              <span className="text-lg font-bold">GD INDUSTRIES</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for quality clothing and fashion accessories. Serving customers with style and
              excellence since our inception.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Dehiwala, Sri Lanka</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                All Products
              </Link>
              <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Categories
              </Link>
              <Link href="/offers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Special Offers
              </Link>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About Us
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Returns & Exchanges
              </Link>
              <Link href="/size-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Size Guide
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>0779858233</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span>devadasagowtham@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>WhatsApp Support</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 GD Industries. All rights reserved. | CEO: Gawtham Devadasa
          </p>
        </div>
      </div>
    </footer>
  )
}
