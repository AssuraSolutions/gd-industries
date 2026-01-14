"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface SettingsFormData {
  storeName: string
  storeEmail: string
  storePhone: string
  whatsappNumber: string
  storeAddress?: string
  currency: string
  currencySymbol: string
  logoUrl?: string
  faviconUrl?: string
}

/**
 * Get settings from database
 * Creates default settings if none exist
 */
export async function getSettings() {
  try {
    let settings = await prisma.settings.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          storeName: "GD Industries",
          storeEmail: "devadasagowtham@gmail.com",
          storePhone: "0779858233",
          whatsappNumber: "+94779858233",
          storeAddress: "Dehiwala, Sri Lanka",
          currency: "LKR",
          currencySymbol: "Rs",
        },
      })
    }

    return { success: true, settings }
  } catch (error) {
    console.error("Error fetching settings:", error)
    return { success: false, error: "Failed to fetch settings" }
  }
}

/**
 * Update settings in database
 */
export async function updateSettings(data: Partial<SettingsFormData>) {
  try {
    // Get existing settings
    let settings = await prisma.settings.findFirst()

    if (!settings) {
      // Create new settings if none exist
      settings = await prisma.settings.create({
        data: {
          storeName: data.storeName || "",
          storeEmail: data.storeEmail || "",
          storePhone: data.storePhone || "",
          whatsappNumber: data.whatsappNumber || "",
          storeAddress: data.storeAddress || "",
          currency: data.currency || "",
          currencySymbol: data.currencySymbol || ""
        },
      })
    } else {
      // Update existing settings
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    }

    revalidatePath("/admin/settings")
    return { success: true, settings }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}
