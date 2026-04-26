"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { LoginForm } from "@/components/admin/login-form"
import { useAuth } from "@/lib/auth"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, loading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50 h-16">
        <AdminHeader />
      </div>
  
      <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 z-40">
        <AdminSidebar />
      </div>
  
      <main className="ml-64 mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
        {children}
      </main>
    </div>
  )
}
