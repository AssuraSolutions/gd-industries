import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/categories/[id]/products
 * Get all products for a category including products from child categories
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // First, check if the category exists
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Find all child categories (where parentId equals this category ID)
    const childCategories = await prisma.category.findMany({
      where: { parentId: id },
      select: { id: true },
    })

    // Create array of category IDs to search (parent + all children)
    const categoryIds = [id, ...childCategories.map(child => child.id)]

    // Get all products that belong to these categories
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryIds,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            parentId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching category products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
