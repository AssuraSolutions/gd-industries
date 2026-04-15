"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, Twitter, Instagram } from "lucide-react"
import { getSettings } from "@/app/admin/settings/actions"
import type { SettingsFormData } from "@/app/admin/settings/actions"
import Image from "next/image"

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
    <footer className="bg-slate-900 text-slate-300 py-20 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-4">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center gap-4">
                <Image src="/images/gd-logo.png" alt="GD Industries" width={40} height={40} className="rounded" />
                <div>
                  <h1 className="text-xl font-bold text-white">GD INDUSTRIES</h1>
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Your trusted partner for quality clothing and fashion accessories. Serving customers with style and excellence since our inception.
            </p>
            <div className="flex space-x-5">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-all text-white group"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 transition-transform group-hover:scale-110" fill="currentColor" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-all text-white group"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Navigation</h5>
            <ul className="space-y-4">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary transition-colors flex items-center gap-2">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Customer Service</h5>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors flex items-center gap-2">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h5 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">Contact Info</h5>
            <ul className="space-y-5 text-sm">
              {settings?.storeAddress && (
                <li className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{settings.storeAddress}</span>
                </li>
              )}
              {settings?.storePhone && (
                <li className="flex items-center gap-4">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span>{settings.storePhone}</span>
                </li>
              )}
              {settings?.storeEmail && (
                <li className="flex items-center gap-4">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <span>{settings.storeEmail}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-10 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© 2026 GD Industries Private Limited. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
