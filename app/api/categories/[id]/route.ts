import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/categories/[id]
 * Fetch a single category by ID or slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    let category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        subcategories: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    })

    // If not found by ID, try slug
    if (!category) {
      category = await prisma.category.findUnique({
        where: { slug: id },
        include: {
          parent: true,
          subcategories: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
      })
    }

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
          category: null,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      category,
    })
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
        category: null,
      },
      { status: 500 }
    )
  }
}
