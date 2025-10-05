"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminAccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-blue-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/images/gd-logo.png" alt="GD Industries" width={60} height={60} className="rounded" />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            Admin Access
          </CardTitle>
          <CardDescription>Access the GD Industries admin panel to manage your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Click below to access the admin dashboard where you can manage products, orders, and store settings.
          </p>

          <Link href="/admin" className="block">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Go to Admin Panel
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to Store
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
