"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/lib/toast"
import { getSettings, updateSettings, type SettingsFormData } from "./actions"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsFormData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    setIsLoading(true)
    try {
      const result = await getSettings()
      if (result.success && result.settings) {
        setSettings(result.settings)
      } else {
        toast.error("Failed to load settings")
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      toast.error("Failed to load settings")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveStoreInfo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      storeName: formData.get("storeName") as string,
      storeEmail: formData.get("storeEmail") as string,
      storePhone: formData.get("storePhone") as string,
      storeAddress: formData.get("storeAddress") as string,
      currency: formData.get("currency") as string,
      currencySymbol: formData.get("currencySymbol") as string
    }

    try {
      const result = await updateSettings(data)
      if (result.success) {
        toast.success("Store settings updated successfully")
        loadSettings()
      } else {
        toast.error(result.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to update settings")
    } finally {
      setIsSaving(false)
    }
  }

  async function handleSaveWhatsApp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)
    const data = {
      whatsappNumber: formData.get("whatsappNumber") as string,
    }

    try {
      const result = await updateSettings(data)
      if (result.success) {
        toast.success("WhatsApp settings updated successfully")
        loadSettings()
      } else {
        toast.error(result.error || "Failed to update settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Failed to update settings")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Failed to load settings</p>
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings and preferences</p>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList>
          <TabsTrigger value="store">Store Info</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          <form onSubmit={handleSaveStoreInfo}>
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>Update your store details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" name="storeName" defaultValue={settings.storeName} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input id="storeEmail" name="storeEmail" type="email" defaultValue={settings.storeEmail} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storePhone">Contact Number</Label>
                  <Input id="storePhone" name="storePhone" defaultValue={settings.storePhone} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Textarea id="storeAddress" name="storeAddress" rows={2} defaultValue={settings.storeAddress || ""} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" name="currency" defaultValue={settings.currency} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currencySymbol">Currency Symbol</Label>
                    <Input id="currencySymbol" name="currencySymbol" defaultValue={settings.currencySymbol} required />
                  </div>
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-6">
          <form onSubmit={handleSaveWhatsApp}>
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration</CardTitle>
                <CardDescription>Configure WhatsApp for customer support</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp Number (with country code)</Label>
                  <Input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    placeholder="+923001234567"
                    defaultValue={settings.whatsappNumber}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your WhatsApp number with country code (e.g., +923001234567)
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">WhatsApp Button Status</p>
                    <p className="text-sm text-muted-foreground">Show floating WhatsApp button on website</p>
                  </div>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
