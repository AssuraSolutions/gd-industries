"use client"

import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import Image from "next/image"

export function AdminHeader() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/images/gd-logo.png" alt="GD Industries" width={40} height={40} className="rounded" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">GD Industries</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="h-4 w-4" />
            <span>{user?.name}</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
