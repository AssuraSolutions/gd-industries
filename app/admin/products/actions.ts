'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema for product creation
const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  originalPrice: z.number().positive().nullable().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  stockCount: z.number().int().min(0).default(0),
  sku: z.string().nullable().optional(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>

/**
 * Generate SKU in format: NAME-CATEGORY-NUMBER
 * Example: ELEC-USB-002
 */
async function generateSKU(productName: string, categoryId: string): Promise<string> {
  try {
    // Get category details
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { name: true }
    })

    if (!category) {
      throw new Error('Category not found')
    }

    // Generate name prefix (first 4 letters, uppercase)
    const namePrefix = productName
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 4)
      .toUpperCase()
      .padEnd(4, 'X')

    // Generate category prefix (first 3 letters, uppercase)
    const categoryPrefix = category.name
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 3)
      .toUpperCase()
      .padEnd(3, 'X')

    // Get total count of products in the database
    const productCount = await prisma.product.count()

    // Next number is total count + 1
    const nextNumber = productCount + 1

    // Format: NAME-CATEGORY-NUMBER (padded to 5 digits)
    const sku = `${namePrefix}-${categoryPrefix}-${nextNumber.toString().padStart(5, '0')}`

    return sku
  } catch (error) {
    console.error('Error generating SKU:', error)
    // Fallback SKU generation
    return `PROD-${Date.now()}`
  }
}

export async function createProduct(data: CreateProductInput) {
  try {
    // Validate input
    const validatedData = createProductSchema.parse(data)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return {
        success: false,
        error: 'A product with this name already exists',
      }
    }

    // Generate SKU automatically if not provided
    let sku = validatedData.sku || await generateSKU(validatedData.name, validatedData.categoryId)

    // Check if generated SKU already exists (should be unique)
    if (sku) {
      const existingSKU = await prisma.product.findUnique({
        where: { sku },
      })

      if (existingSKU) {
        // Regenerate with timestamp suffix if collision occurs
        sku = `${sku}-${Date.now().toString().slice(-4)}`
      }
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice || null,
        categoryId: validatedData.categoryId,
        images: validatedData.images,
        sizes: validatedData.sizes,
        colors: validatedData.colors,
        inStock: validatedData.inStock,
        featured: validatedData.featured,
        stockCount: validatedData.stockCount,
        sku,
      },
      include: {
        category: true,
      },
    })

    // Revalidate the products page
    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
      product,
    }
  } catch (error) {
    console.error('Error creating product:', error)

    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return {
        success: false,
        error: errorMessage,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create product. Please try again.',
    }
  }
}

export async function updateProduct(id: string, data: Partial<CreateProductInput>) {
  try {
    // Update slug if name changed
    let slug: string | undefined
    if (data.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if slug already exists for a different product
      const existingProduct = await prisma.product.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existingProduct) {
        return {
          success: false,
          error: 'A product with this name already exists',
        }
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
      include: {
        category: true,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')
    revalidatePath(`/products/${id}`)

    return {
      success: true,
      product,
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      success: false,
      error: 'Failed to update product. Please try again.',
    }
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    })

    revalidatePath('/admin/products')
    revalidatePath('/products')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: 'Failed to delete product. Please try again.',
    }
  }
}

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      products,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      success: false,
      error: 'Failed to fetch products',
      products: [],
    }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return {
      success: true,
      categories,
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      error: 'Failed to fetch categories',
      categories: [],
    }
  }
}
