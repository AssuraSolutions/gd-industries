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
import { Plus, Edit, Trash2, Eye, Folder, FolderTree } from "lucide-react"
import { createCategory, deleteCategory, updateCategory, type CreateCategoryInput } from "./actions"
import { toast } from "@/lib/toast"
import type { Category } from "@prisma/client"

type CategoryWithRelations = Category & {
    parent: Category | null
    subcategories: Category[]
    _count: {
        products: number
        subcategories: number
    }
}

interface CategoriesClientProps {
    categories: CategoryWithRelations[]
}

export default function CategoriesClient({ categories: initialCategories }: CategoriesClientProps) {
    const [categories, setCategories] = useState(initialCategories)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryWithRelations | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<CategoryWithRelations | null>(null)

    const [formData, setFormData] = useState<Partial<CreateCategoryInput>>({
        name: "",
        description: "",
        image: "",
        parentId: null,
    })

    const [uploadedImage, setUploadedImage] = useState<string[]>([])

    // Get parent categories (categories without a parent)
    const parentCategories = categories.filter(cat => !cat.parentId)

    const handleAddCategory = async () => {
        if (!formData.name) {
            toast.error("Validation Error", "Please enter a category name")
            return
        }

        setIsSubmitting(true)

        try {
            const cleanData: CreateCategoryInput = {
                name: formData.name,
                description: formData.description || null,
                image: uploadedImage[0] || null,
                parentId: formData.parentId || null,
            }

            const result = await createCategory(cleanData)

            if (result.success && result.category) {
                toast.success("Success", "Category created successfully")

                setCategories([result.category as CategoryWithRelations, ...categories])
                setIsAddDialogOpen(false)
                resetForm()
            } else {
                toast.error("Error", result.error || "Failed to create category")
            }
        } catch (error) {
            toast.error("Error", "An unexpected error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id)
        setDeleteConfirmOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (!categoryToDelete) return

        try {
            const result = await deleteCategory(categoryToDelete)

            if (result.success) {
                toast.success("Success", "Category deleted successfully")
                setCategories(categories.filter((c) => c.id !== categoryToDelete))
            } else {
                toast.error("Error", result.error || "Failed to delete category")
            }
        } catch (error) {
            toast.error("Error", "An unexpected error occurred")
        } finally {
            setDeleteConfirmOpen(false)
            setCategoryToDelete(null)
        }
    }

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false)
        setCategoryToDelete(null)
    }

    const handleViewCategory = (category: CategoryWithRelations) => {
        setSelectedCategory(category)
        setViewDialogOpen(true)
    }

    const handleEditCategory = (category: CategoryWithRelations) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description || "",
            image: category.image || "",
            parentId: category.parentId || null,
        })
        setUploadedImage(category.image ? [category.image] : [])
        setIsEditDialogOpen(true)
    }

    const handleUpdateCategory = async () => {
        if (!editingCategory) return

        if (!formData.name) {
            toast.error("Validation Error", "Please enter a category name")
            return
        }

        setIsSubmitting(true)

        try {
            const cleanData: Partial<CreateCategoryInput> = {
                name: formData.name,
                description: formData.description || null,
                image: uploadedImage[0] || null,
                parentId: formData.parentId || null,
            }

            const result = await updateCategory(editingCategory.id, cleanData)

            if (result.success && result.category) {
                toast.success("Success", "Category updated successfully")

                // Update the category in the list
                setCategories(categories.map((c) =>
                    c.id === editingCategory.id ? (result.category as CategoryWithRelations) : c
                ))
                setIsEditDialogOpen(false)
                setEditingCategory(null)
                resetForm()
            } else {
                toast.error("Error", result.error || "Failed to update category")
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
            image: "",
            parentId: null,
        })
        setUploadedImage([])
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Category Management</h1>
                    <p className="text-muted-foreground">Manage your product categories</p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-red-500 hover:bg-red-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Category</DialogTitle>
                            <DialogDescription>Fill in the category details below</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Category Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter category name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description || ""}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter category description"
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="parentId">Parent Category (Optional)</Label>
                                <Select
                                    value={formData.parentId || "none"}
                                    onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? null : value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select parent category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None (Top Level)</SelectItem>
                                        {parentCategories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Category Image (Optional)</Label>
                                <ImageUpload
                                    value={uploadedImage}
                                    onChange={setUploadedImage}
                                    maxImages={1}
                                    minImages={0}
                                    disabled={isSubmitting}
                                />
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
                            <Button onClick={handleAddCategory} className="bg-red-500 hover:bg-red-600" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Add Category"}
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
                                    <th className="text-left p-4 font-medium">Category</th>
                                    <th className="text-left p-4 font-medium">Parent</th>
                                    <th className="text-left p-4 font-medium">Products</th>
                                    <th className="text-left p-4 font-medium">Subcategories</th>
                                    <th className="text-left p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                            No categories found. Add your first category to get started.
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((category) => (
                                        <tr key={category.id} className="border-b hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    {category.image ? (
                                                        <img
                                                            src={category.image}
                                                            alt={category.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                                            <Folder className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{category.name}</p>
                                                        {category.description && (
                                                            <p className="text-xs text-muted-foreground line-clamp-1">
                                                                {category.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {category.parent ? (
                                                    <Badge variant="outline" className="gap-1">
                                                        <FolderTree className="h-3 w-3" />
                                                        {category.parent.name}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Top Level</Badge>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="default">{category._count?.products || 0} products</Badge>
                                            </td>
                                            <td className="p-4">
                                                {(category._count?.subcategories || 0) > 0 ? (
                                                    <Badge variant="secondary">{category._count?.subcategories || 0} subcategories</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">None</span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleViewCategory(category)}
                                                        title="View"
                                                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEditCategory(category)}
                                                        title="Edit"
                                                        className="hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDeleteClick(category.id)}
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

            {/* Edit Category Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Edit className="h-5 w-5" />
                            Edit Category
                        </DialogTitle>
                        <DialogDescription>Update the category details below</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Category Name *</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter category name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={formData.description || ""}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Enter category description"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-parentId">Parent Category (Optional)</Label>
                            <Select
                                value={formData.parentId || "none"}
                                onValueChange={(value) => setFormData({ ...formData, parentId: value === "none" ? null : value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select parent category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">None (Top Level)</SelectItem>
                                    {parentCategories
                                        .filter(cat => cat.id !== editingCategory?.id) // Don't allow category to be its own parent
                                        .map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Category Image (Optional)</Label>
                            <ImageUpload
                                value={uploadedImage}
                                onChange={setUploadedImage}
                                maxImages={1}
                                minImages={0}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsEditDialogOpen(false)
                                setEditingCategory(null)
                                resetForm()
                            }}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateCategory}
                            className="bg-yellow-500 hover:bg-yellow-600"
                            disabled={isSubmitting}
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            {isSubmitting ? "Updating..." : "Update Category"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* View Category Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Eye className="h-5 w-5" />
                            Category Details
                        </DialogTitle>
                    </DialogHeader>
                    {selectedCategory && (
                        <div className="space-y-6">
                            {/* Image */}
                            {selectedCategory.image && (
                                <div className="space-y-3">
                                    <Label className="text-base">Category Image</Label>
                                    <div className="relative aspect-video max-w-sm">
                                        <img
                                            src={selectedCategory.image}
                                            alt={selectedCategory.name}
                                            className="w-full h-full object-cover rounded-lg border"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Basic Info */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Category Name</Label>
                                <p className="text-2xl font-semibold">{selectedCategory.name}</p>
                            </div>

                            {selectedCategory.description && (
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Description</Label>
                                    <p className="text-base leading-relaxed">{selectedCategory.description}</p>
                                </div>
                            )}

                            {/* Parent Category */}
                            <div className="space-y-2">
                                <Label className="text-muted-foreground">Parent Category</Label>
                                {selectedCategory.parent ? (
                                    <Badge variant="outline" className="text-base px-3 py-1 gap-2">
                                        <FolderTree className="h-4 w-4" />
                                        {selectedCategory.parent.name}
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="text-base px-3 py-1">
                                        Top Level Category
                                    </Badge>
                                )}
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Products</Label>
                                    <p className="text-xl font-semibold">
                                        {selectedCategory._count.products} product{selectedCategory._count.products !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Subcategories</Label>
                                    <p className="text-xl font-semibold">
                                        {selectedCategory._count.subcategories} subcategor{selectedCategory._count.subcategories !== 1 ? 'ies' : 'y'}
                                    </p>
                                </div>
                            </div>

                            {/* Subcategories List */}
                            {selectedCategory.subcategories.length > 0 && (
                                <div className="space-y-2">
                                    <Label className="text-muted-foreground">Subcategories</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategory.subcategories.map((sub) => (
                                            <Badge key={sub.id} variant="secondary" className="px-3 py-1">
                                                {sub.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="pt-4 border-t grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div>
                                    <Label className="text-muted-foreground">Created At</Label>
                                    <p>{new Date(selectedCategory.createdAt).toLocaleString()}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Last Updated</Label>
                                    <p>{new Date(selectedCategory.updatedAt).toLocaleString()}</p>
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
                            Delete Category
                        </DialogTitle>
                        <DialogDescription className="pt-3">
                            Are you sure you want to delete this category? This action cannot be undone.
                            {categoryToDelete && (categories.find(c => c.id === categoryToDelete)?._count?.products || 0) > 0 && (
                                <span className="block mt-2 text-red-600 font-medium">
                                    Warning: This category has products associated with it and cannot be deleted.
                                </span>
                            )}
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
                            Delete Category
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
