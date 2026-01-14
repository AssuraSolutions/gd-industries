import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
    const where: any = {}

    // Filter for parent categories only (top-level)
    if (parentOnly === 'true') {
      where.parentId = null
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        parent: true,
        subcategories: true,
        ...(includeProducts === 'true' && {
          _count: {
            select: {
              products: true,
            },
          },
        }),
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length,
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
