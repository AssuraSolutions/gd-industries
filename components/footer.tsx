"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { getSettings } from "@/app/admin/settings/actions"
import type { SettingsFormData } from "@/app/admin/settings/actions"

export function Footer() {
  const [settings, setSettings] = useState<SettingsFormData | null>(null)

  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getSettings()
        if (result.success && result.settings) {
          setSettings(result.settings)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      }
    }
    loadSettings()
  }, [])

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image src="/images/gd-logo.png" alt="GD Industries" width={32} height={32} className="h-8 w-8" />
              <span className="text-lg font-bold">{settings?.storeName || "GD INDUSTRIES"}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for quality clothing and fashion accessories. Serving customers with style and
              excellence since our inception.
            </p>
            {settings?.storeAddress && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{settings.storeAddress}</span>
              </div>
            )}
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
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              {settings?.storePhone && (
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{settings.storePhone}</span>
                </div>
              )}
              {settings?.storeEmail && (
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>{settings.storeEmail}</span>
                </div>
              )}
              {settings?.whatsappNumber && (
                <div className="flex items-center space-x-2 text-sm">
                  <MessageCircle className="h-4 w-4 text-primary" />
                  <span>WhatsApp Support</span>
                </div>
              )}
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
