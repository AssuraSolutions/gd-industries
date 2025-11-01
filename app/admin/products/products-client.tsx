"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Plus, Edit, Trash2, Eye, Upload } from "lucide-react"
import { createProduct, deleteProduct, updateProduct, type CreateProductInput } from "./actions"
import { toast } from "@/lib/toast"
import type { Product, Category } from "@prisma/client"

type ProductWithCategory = Product & {
    category: Category
}

interface ProductsClientProps {
    products: ProductWithCategory[]
    categories: Category[]
}

export default function ProductsClient({ products: initialProducts, categories }: ProductsClientProps) {
    const [products, setProducts] = useState(initialProducts)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<ProductWithCategory | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)

    const [formData, setFormData] = useState<Partial<CreateProductInput>>({
        name: "",
        description: "",
        price: 0,
        originalPrice: undefined,
        categoryId: "",
        images: [],
        sizes: [],
        colors: [],
        inStock: true,
        featured: false,
        stockCount: 0,
        sku: "",
    })

    // Store raw string values for comma-separated inputs
    const [sizesInput, setSizesInput] = useState("")
    const [colorsInput, setColorsInput] = useState("")
    const [uploadedImages, setUploadedImages] = useState<string[]>([])

    const handleAddProduct = async () => {
        if (!formData.name || !formData.description || !formData.categoryId) {
            toast.error("Validation Error", "Please fill in all required fields (name, description, category)")
            return
        }

        if (!formData.price || formData.price <= 0) {
            toast.error("Validation Error", "Please enter a valid price")
            return
        }

        setIsSubmitting(true)

        try {
            // Validate images
            if (uploadedImages.length < 1) {
                toast.error("Validation Error", "Please upload at least 1 product image")
                setIsSubmitting(false)
                return
            }

            // Parse comma-separated inputs
            const sizes = sizesInput ? sizesInput.split(",").map((s) => s.trim()).filter(Boolean) : []
            const colors = colorsInput ? colorsInput.split(",").map((c) => c.trim()).filter(Boolean) : []

            // Clean up the data before sending
            const cleanData: CreateProductInput = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                originalPrice: formData.originalPrice && formData.originalPrice > 0 ? formData.originalPrice : undefined,
                categoryId: formData.categoryId,
                images: uploadedImages,
                sizes,
                colors,
                inStock: formData.inStock ?? true,
                featured: formData.featured ?? false,
                stockCount: formData.stockCount || 0,
                sku: formData.sku && formData.sku.trim() !== "" ? formData.sku : undefined,
            }

            const result = await createProduct(cleanData)

            if (result.success && result.product) {
                toast.success("Success", "Product created successfully")

                setProducts([result.product as ProductWithCategory, ...products])
                setIsAddDialogOpen(false)
                resetForm()
            } else {
                toast.error("Error", result.error || "Failed to create product")
            }
        } catch (error) {
            toast.error("Error", "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClick = (id: string) => {
        setProductToDelete(id)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!productToDelete) return

        try {
            const result = await deleteProduct(productToDelete)

            if (result.success) {
                toast.success("Success", "Product deleted successfully")
                setProducts(products.filter((p) => p.id !== productToDelete))
            } else {
                toast.error("Error", result.error || "Failed to delete product")
            }
        } catch (error) {
            toast.error("Error", "An unexpected error occurred")
        } finally {
            setDeleteConfirmOpen(false)
            setProductToDelete(null)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false)
        setProductToDelete(null)
    }

    const handleViewProduct = (product: ProductWithCategory) => {
        setSelectedProduct(product)
        setViewDialogOpen(true)
    }

    const handleEditProduct = (product: ProductWithCategory) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice || undefined,
            categoryId: product.categoryId,
            images: product.images,
            sizes: product.sizes,
            colors: product.colors,
            inStock: product.inStock,
            featured: product.featured,
            stockCount: product.stockCount,
            sku: product.sku || "",
        })
        setSizesInput(product.sizes.join(", "))
        setColorsInput(product.colors.join(", "))
        setUploadedImages(product.images)
        setIsEditDialogOpen(true)
    }

    const handleUpdateProduct = async () => {
        if (!editingProduct) return

        if (!formData.name || !formData.description || !formData.categoryId) {
            toast.error("Validation Error", "Please fill in all required fields (name, description, category)")
            return
        }

        if (!formData.price || formData.price <= 0) {
            toast.error("Validation Error", "Please enter a valid price")
            return
        }

        setIsSubmitting(true)

        try {
            // Validate images
            if (uploadedImages.length < 1) {
                toast.error("Validation Error", "Please upload at least 1 product image")
                setIsSubmitting(false)
                return
            }

            // Parse comma-separated inputs
            const sizes = sizesInput ? sizesInput.split(",").map((s) => s.trim()).filter(Boolean) : []
            const colors = colorsInput ? colorsInput.split(",").map((c) => c.trim()).filter(Boolean) : []

            // Clean up the data before sending
            const cleanData: Partial<CreateProductInput> = {
                name: formData.name,
                description: formData.description,
                price: formData.price,
                originalPrice: formData.originalPrice && formData.originalPrice > 0 ? formData.originalPrice : undefined,
                categoryId: formData.categoryId,
                images: uploadedImages,
                sizes,
                colors,
                inStock: formData.inStock ?? true,
                featured: formData.featured ?? false,
                stockCount: formData.stockCount || 0,
                sku: formData.sku && formData.sku.trim() !== "" ? formData.sku : undefined,
            }

            const result = await updateProduct(editingProduct.id, cleanData)

            if (result.success && result.product) {
                toast.success("Success", "Product updated successfully")

                // Update the product in the list
                setProducts(products.map((p) =>
                    p.id === editingProduct.id ? (result.product as ProductWithCategory) : p
                ))
                setIsEditDialogOpen(false)
                setEditingProduct(null)
                resetForm()
            } else {
                toast.error("Error", result.error || "Failed to update product")
            }
        } catch (error) {
            toast.error("Error", "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: 0,
            originalPrice: undefined,
            categoryId: "",
            images: [],
            sizes: [],
            colors: [],
            inStock: true,
            featured: false,
            stockCount: 0,
            sku: "",
        })
        setSizesInput("")
        setColorsInput("")
        setUploadedImages([])
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Product Management</h1>
                    <p className="text-muted-foreground">Manage your product inventory</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Product</DialogTitle>
                            <DialogDescription>Fill in the product details below</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter product description"
                                    rows={4}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (Rs.) *</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="originalPrice">Original Price (Rs.)</Label>
                                    <Input
                                        id="originalPrice"
                                        type="number"
                                        value={formData.originalPrice || ""}
                                        onChange={(e) =>
                                            setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })
                                        }
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category *</Label>
                                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stockCount">Stock Count</Label>
                                    <Input
                                        id="stockCount"
                                        type="number"
                                        value={formData.stockCount}
                                        onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                                        placeholder="0"
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sku" className="flex items-center gap-2">
                                    SKU (Auto-generated)
                                    <span className="text-xs text-muted-foreground font-normal">
                                        Format: NAME-CATEGORY-###
                                    </span>
                                </Label>
                                <Input
                                    id="sku"
                                    value={formData.sku || ""}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value || undefined })}
                                    placeholder="Will be auto-generated (e.g., TSH-MEN-00001)"
                                    className="bg-muted/50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave empty for automatic generation or enter a custom SKU
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="sizes">Sizes (comma separated)</Label>
                                <Input
                                    id="sizes"
                                    value={sizesInput}
                                    onChange={(e) => setSizesInput(e.target.value)}
                                    placeholder="S, M, L, XL"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Separate multiple sizes with commas
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="colors">Colors (comma separated)</Label>
                                <Input
                                    id="colors"
                                    value={colorsInput}
                                    onChange={(e) => setColorsInput(e.target.value)}
                                    placeholder="Black, White, Blue"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Separate multiple colors with commas
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label>Product Images *</Label>
                                <ImageUpload
                                    value={uploadedImages}
                                    onChange={setUploadedImages}
                                    maxImages={3}
                                    minImages={1}
                                    disabled={isSubmitting}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="inStock"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                    className="rounded"
                                />
                                <Label htmlFor="inStock">In Stock</Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="rounded"
                                />
                                <Label htmlFor="featured">Featured Product</Label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setIsAddDialogOpen(false)
                                    resetForm()
                                }}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleAddProduct} className="bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Add Product"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 font-medium">Product</th>
                                    <th className="text-left p-4 font-medium">Category</th>
                                    <th className="text-left p-4 font-medium">Price</th>
                                    <th className="text-left p-4 font-medium">Stock</th>
                                    <th className="text-left p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No products found. Add your first product to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={product.images[0] || "/placeholder.svg"}
                                                        alt={product.name}
                                                        className="w-12 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium">{product.name}</p>
                                                        <p className="text-xs text-muted-foreground font-mono">
                                                            SKU: {product.sku || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">{product.category.name}</td>
                                            <td className="p-4 font-medium">Rs. {product.price.toLocaleString()}</td>
                                            <td className="p-4">
                                                <Badge variant={product.inStock ? "default" : "destructive"}>
                                                    {product.inStock ? "In Stock" : "Out of Stock"}
                                                </Badge>
                                                {product.featured && (
                                                    <Badge variant="secondary" className="ml-2">
                                                        Featured
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewProduct(product)}
                                                        title="View"
                                                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditProduct(product)}
                                                        title="Edit"
                                                        className="hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDeleteClick(product.id)}
                                                        title="Delete"
                                                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Edit Product
                        </DialogTitle>
                        <DialogDescription>Update the product details below</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Product Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter product name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description *</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter product description"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-price">Price (Rs.) *</Label>
                                <Input
                                    id="edit-price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-originalPrice">Original Price (Rs.)</Label>
                                <Input
                                    id="edit-originalPrice"
                                    type="number"
                                    value={formData.originalPrice || ""}
                                    onChange={(e) =>
                                        setFormData({ ...formData, originalPrice: e.target.value ? Number(e.target.value) : undefined })
                                    }
                                    placeholder="0"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category *</Label>
                                <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-stockCount">Stock Count</Label>
                                <Input
                                    id="edit-stockCount"
                                    type="number"
                                    value={formData.stockCount}
                                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-sku">SKU</Label>
                            <Input
                                id="edit-sku"
                                value={formData.sku || ""}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value || undefined })}
                                placeholder="Product SKU"
                                className="bg-muted/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                SKU cannot be auto-regenerated during edit
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-sizes">Sizes (comma separated)</Label>
                            <Input
                                id="edit-sizes"
                                value={sizesInput}
                                onChange={(e) => setSizesInput(e.target.value)}
                                placeholder="S, M, L, XL"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-colors">Colors (comma separated)</Label>
                            <Input
                                id="edit-colors"
                                value={colorsInput}
                                onChange={(e) => setColorsInput(e.target.value)}
                                placeholder="Black, White, Blue"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Product Images *</Label>
                            <ImageUpload
                                value={uploadedImages}
                                onChange={setUploadedImages}
                                maxImages={3}
                                minImages={1}
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-inStock"
                                checked={formData.inStock}
                                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="edit-inStock">In Stock</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="edit-featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="rounded"
                            />
                            <Label htmlFor="edit-featured">Featured Product</Label>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false)
                                setEditingProduct(null)
                                resetForm()
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateProduct}
                            className="bg-yellow-500 hover:bg-yellow-600"
                            disabled={isSubmitting}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Updating..." : "Update Product"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Product Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Product Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="space-y-6">
                            {/* Image Gallery */}
                            <div className="space-y-3">
                                <Label className="text-base">Product Images</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    {selectedProduct.images.map((image, index) => (
                                        <div key={index} className="relative aspect-square group">
                                            <img
                                                src={image}
                                                alt={`${selectedProduct.name} ${index + 1}`}
                                                className="w-full h-full object-cover rounded-lg border"
                                            />
                                            {index === 0 && (
                                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                    Primary
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Product Name</Label>
                                    <p className="text-lg font-semibold">{selectedProduct.name}</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">SKU</Label>
                                    <p className="text-lg font-mono">{selectedProduct.sku || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Description</Label>
                                <p className="text-base leading-relaxed">{selectedProduct.description}</p>
                            </div>

                            {/* Pricing */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Current Price</Label>
                                    <p className="text-2xl font-bold text-green-600">
                                        Rs. {selectedProduct.price.toLocaleString()}
                                    </p>
                                </div>
                                {selectedProduct.originalPrice && (
                                    <div className="space-y-2">
                                        <Label className="text-muted-foreground">Original Price</Label>
                                        <p className="text-xl font-semibold text-muted-foreground line-through">
                                            Rs. {selectedProduct.originalPrice.toLocaleString()}
                                        </p>
                                        <Badge variant="destructive" className="mt-1">
                                            {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% OFF
                                        </Badge>
                                    </div>
                                )}
                            </div>

                            {/* Category & Stock */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Category</Label>
                                    <Badge variant="outline" className="text-base px-3 py-1">
                                        {selectedProduct.category.name}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Stock Status</Label>
                                    <div>
                                        <Badge variant={selectedProduct.inStock ? "default" : "destructive"}>
                                            {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Stock Count</Label>
                                    <p className="text-lg font-semibold">{selectedProduct.stockCount || 0} units</p>
                                </div>
                            </div>

                            {/* Sizes & Colors */}
                            {(selectedProduct.sizes.length > 0 || selectedProduct.colors.length > 0) && (
                                <div className="grid grid-cols-2 gap-4">
                                    {selectedProduct.sizes.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Available Sizes</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProduct.sizes.map((size, index) => (
                                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                                        {size}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {selectedProduct.colors.length > 0 && (
                                        <div className="space-y-2">
                                            <Label className="text-muted-foreground">Available Colors</Label>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedProduct.colors.map((color, index) => (
                                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                                        {color}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Featured Badge */}
                            {selectedProduct.featured && (
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Special Status</Label>
                                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-base px-3 py-1">
                                        ⭐ Featured Product
                                    </Badge>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="pt-4 border-t grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>
                                    <Label className="text-muted-foreground">Created At</Label>
                                    <p>{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Last Updated</Label>
                                    <p>{new Date(selectedProduct.updatedAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setViewDialogOpen(false)}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="h-5 w-5" />
                            Delete Product
                        </DialogTitle>
                        <DialogDescription className="pt-3">
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            onClick={handleDeleteCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Product
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
