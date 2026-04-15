"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { getSettings } from "@/app/admin/settings/actions"
import type { SettingsFormData } from "@/app/admin/settings/actions"
import { toast } from "@/lib/toast"

export default function ContactPage() {
  const [settings, setSettings] = useState<SettingsFormData | null>(null)
  const [isLoadingSettings, setIsLoadingSettings] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        const result = await getSettings()
        if (result.success && result.settings) {
          setSettings(result.settings)
        }
      } catch (error) {
        console.error("Error loading settings:", error)
      } finally {
        setIsLoadingSettings(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Construct email subject and body
    const subject = encodeURIComponent(`Contact Form: ${formData.subject}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone || 'N/A'}\n` +
      `Subject: ${formData.subject}\n\n` +
      `Message:\n${formData.message}`
    )

    // Get email from settings or use default
    const email = settings?.storeEmail || 'concierge@gdindustries.com'

    // Open mailto link
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`

    // Show success message
    toast.success("Email client opened", "Your default email client should open with the message")

    // Reset form after a short delay
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      })
    }, 1000)
  }

  const handleWhatsApp = () => {
    const whatsappNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '94779858233'
    const message = encodeURIComponent("Hi! I'd like to get in touch regarding your products.")
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      
      {/* Hero Header */}
      <header className="py-16 px-4 textured-bg bg-[#F9F7F2] dark:bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Have questions about our products or need assistance? We're here to help! Reach out to us through any of the methods below.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Sidebar - Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            {/* Contact Information Card */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="font-display text-2xl font-bold mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
                Contact Information
              </h2>
              
              {isLoadingSettings ? (
                <div className="space-y-8">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Boutique Address */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Our Boutique</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {settings?.storeAddress || "123 Silk Road, Heritage District,\nColombo, Sri Lanka"}
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Call Us</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {settings?.storePhone || "+94 11 234 5678"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Email Us</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {settings?.storeEmail || "concierge@gdindustries.com"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp Support Card */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-display text-xl font-bold text-emerald-900 dark:text-emerald-400">
                    WhatsApp Support
                  </h4>
                  <p className="text-sm text-emerald-700 dark:text-emerald-500/80">
                    Get instant support via WhatsApp
                  </p>
                </div>
              </div>
              <p className="text-emerald-800 dark:text-emerald-500/70 mb-6 text-sm">
                For quick responses and instant support, message us on WhatsApp. We're available during business hours to help with your queries.
              </p>
              <button
                onClick={handleWhatsApp}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                Chat on WhatsApp
              </button>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800">
              <div className="mb-10">
                <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
                  <Send className="h-7 w-7 text-primary" />
                  Send us a Message
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary py-3 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary py-3 px-4"
                    />
                  </div>
                </div>

                {/* Phone and Subject Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+94 ..."
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary py-3 px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Subject *
                    </label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData({ ...formData, subject: value })}
                      required
                    >
                      <SelectTrigger className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary py-3 px-4">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="Order Status">Order Status</SelectItem>
                        <SelectItem value="Custom Sizing">Custom Sizing</SelectItem>
                        <SelectItem value="Returns & Exchanges">Returns & Exchanges</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Message *
                  </label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you today?"
                    rows={5}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-lg focus:ring-primary focus:border-primary py-3 px-4"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-all flex items-center justify-center gap-3 text-lg shadow-lg shadow-primary/20"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </Button>

                {/* Response Time Badge */}
                <div className="text-center">
                  <Badge className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full border-none">
                    Typical response time: Under 24 hours
                  </Badge>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
