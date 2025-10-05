"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { offers } from "@/lib/data"

export default function AdminOffersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Offers & Promotions</h1>
          <p className="text-muted-foreground">Manage special offers and discounts</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Offer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{offer.title}</CardTitle>
                <Badge variant={offer.isActive ? "default" : "secondary"}>
                  {offer.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
              <CardDescription>{offer.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Discount:</span>{" "}
                  {offer.discountType === "percentage" ? `${offer.discountValue}%` : `Rs. ${offer.discountValue}`}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Valid:</span> {offer.validFrom.toLocaleDateString()} -{" "}
                  {offer.validTo.toLocaleDateString()}
                </p>
                {offer.minOrderValue && (
                  <p className="text-sm">
                    <span className="font-medium">Min Order:</span> Rs. {offer.minOrderValue}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
