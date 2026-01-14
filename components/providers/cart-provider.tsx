"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { CartItem } from "@/lib/types"

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, "quantity">) => void
    removeItem: (productId: string, size: string, color: string) => void
    updateQuantity: (productId: string, size: string, color: string, quantity: number) => void
    clearCart: () => void
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("gd-cart")
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart))
            } catch (error) {
                console.error("Failed to parse cart from localStorage:", error)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save cart to localStorage when items change (but only after initial load)
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("gd-cart", JSON.stringify(items))
        }
    }, [items, isLoaded])

    const addItem = (item: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existingItem = prev.find(
                (i) => i.productId === item.productId && i.size === item.size && i.color === item.color,
            )

            if (existingItem) {
                return prev.map((i) =>
                    i.productId === item.productId && i.size === item.size && i.color === item.color
                        ? { ...i, quantity: i.quantity + 1 }
                        : i,
                )
            }

            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeItem = (productId: string, size: string, color: string) => {
        setItems((prev) =>
            prev.filter((item) => !(item.productId === productId && item.size === size && item.color === color)),
        )
    }

    const updateQuantity = (productId: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId, size, color)
            return
        }

        setItems((prev) =>
            prev.map((item) =>
                item.productId === productId && item.size === size && item.color === color ? { ...item, quantity } : item,
            ),
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                total,
                itemCount,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider")
    }
    return context
}
