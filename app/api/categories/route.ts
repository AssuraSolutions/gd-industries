import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/categories
 * Fetch categories from database with optional filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const parentOnly = searchParams.get('parentOnly')
    const includeProducts = searchParams.get('includeProducts')

    // Build where clause
    const where: any = {
      publish: true,
    }

    // Filter for parent categories only (top-level)
    if (parentOnly === 'true') {
      where.parentId = null
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        parent: true,
        subcategories: includeProducts === 'true' ? {
          where: {
            publish: true,
          },
          include: {
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
        } : {
          where: {
            publish: true,
          },
        },
        ...(includeProducts === 'true' && {
          _count: {
            select: {
              products: {
                where: {
                  publish: true,
                },
              },
            },
          },
        }),
      },
      orderBy: {
        name: 'asc',
      },
    })

    // If includeProducts, calculate total product count including subcategories
    const categoriesWithTotalCount = includeProducts === 'true' 
      ? categories.map(category => {
          const directProductCount = (category as any)._count?.products || 0
          const subcategoryProductCount = (category.subcategories as any[])?.reduce(
            (sum, subcat) => sum + (subcat._count?.products || 0),
            0
          ) || 0
          return {
            ...category,
            _count: {
              products: directProductCount + subcategoryProductCount,
            },
          }
        })
      : categories

    return NextResponse.json({
      success: true,
      categories: categoriesWithTotalCount,
      count: categoriesWithTotalCount.length,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
        categories: [],
      },
      { status: 500 }
    )
  }
}
