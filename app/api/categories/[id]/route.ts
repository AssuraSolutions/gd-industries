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

    const category = await prisma.category.findFirst({
      where: {
        publish: true,
        OR: [{ id }, { slug: id }],
      },
      include: {
        parent: true,
        subcategories: {
          where: {
            publish: true,
          },
        },
        _count: {
          select: {
            products: {
              where: {
                publish: true,
              },
            },
          },
        },
      },
    })

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
