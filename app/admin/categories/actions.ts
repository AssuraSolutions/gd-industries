'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Validation schema for category creation
const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  parentId: z.string().optional().nullable(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export async function createCategory(data: CreateCategoryInput) {
  try {
    // Validate input
    const validatedData = createCategorySchema.parse(data)

    // Generate slug from name
    const slug = validatedData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return {
        success: false,
        error: 'A category with this name already exists',
      }
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug,
        description: validatedData.description || null,
        image: validatedData.image || null,
        parentId: validatedData.parentId || null,
      },
      include: {
        parent: true,
        subcategories: true,
      },
    })

    // Revalidate the categories page
    revalidatePath('/admin/categories')
    revalidatePath('/categories')

    return {
      success: true,
      category,
    }
  } catch (error) {
    console.error('Error creating category:', error)

    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      return {
        success: false,
        error: errorMessage,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create category. Please try again.',
    }
  }
}

export async function updateCategory(id: string, data: Partial<CreateCategoryInput>) {
  try {
    // Update slug if name changed
    let slug: string | undefined
    if (data.name) {
      slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

      // Check if slug already exists for a different category
      const existingCategory = await prisma.category.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      })

      if (existingCategory) {
        return {
          success: false,
          error: 'A category with this name already exists',
        }
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...data,
        ...(slug && { slug }),
      },
      include: {
        parent: true,
        subcategories: true,
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/categories')
    revalidatePath(`/categories/${id}`)

    return {
      success: true,
      category,
    }
  } catch (error) {
    console.error('Error updating category:', error)
    return {
      success: false,
      error: 'Failed to update category. Please try again.',
    }
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { categoryId: id },
    })

    if (productsCount > 0) {
      return {
        success: false,
        error: `Cannot delete category. It has ${productsCount} product(s) associated with it.`,
      }
    }

    // Check if category has subcategories
    const subcategoriesCount = await prisma.category.count({
      where: { parentId: id },
    })

    if (subcategoriesCount > 0) {
      return {
        success: false,
        error: `Cannot delete category. It has ${subcategoriesCount} subcategory/subcategories.`,
      }
    }

    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/categories')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting category:', error)
    return {
      success: false,
      error: 'Failed to delete category. Please try again.',
    }
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        subcategories: true,
        _count: {
          select: {
            products: true,
            subcategories: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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
