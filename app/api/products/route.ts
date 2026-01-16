import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/products
 * Fetch all products from database with optional filters
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const featured = searchParams.get('featured')
    const inStock = searchParams.get('inStock')
    const availability = searchParams.get('availability')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy')

    // Build where clause
    const where: any = {}

    // Category filtering with parent-child support
    if (categoryId && categoryId !== 'all') {
      // First check if this category is a parent
      const childCategories = await prisma.category.findMany({
        where: { parentId: categoryId },
        select: { id: true },
      })

      if (childCategories.length > 0) {
        // If it's a parent, include products from parent AND all children
        where.categoryId = {
          in: [categoryId, ...childCategories.map(c => c.id)],
        }
      } else {
        // If it's not a parent, just filter by this category
        where.categoryId = categoryId
      }
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Availability filtering
    if (availability === 'in-stock') {
      where.inStock = true
    } else if (availability === 'out-of-stock') {
      where.inStock = false
    } else if (inStock === 'true') {
      where.inStock = true
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' }
    
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          orderBy = { price: 'asc' }
          break
        case 'price-high':
          orderBy = { price: 'desc' }
          break
        case 'name-asc':
          orderBy = { name: 'asc' }
          break
        case 'name-desc':
          orderBy = { name: 'desc' }
          break
        case 'newest':
          orderBy = { createdAt: 'desc' }
          break
        case 'oldest':
          orderBy = { createdAt: 'asc' }
          break
        default:
          orderBy = { createdAt: 'desc' }
      }
    }

    // Pagination
    const pageSize = limit ? parseInt(limit) : undefined
    const pageNumber = page ? parseInt(page) : 1
    const skip = pageSize ? (pageNumber - 1) * pageSize : undefined

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
      ...(pageSize && { take: pageSize }),
      ...(skip && { skip }),
    })

    return NextResponse.json({
      success: true,
      products,
      count: products.length,
      total: totalCount,
      page: pageNumber,
      pageSize: pageSize || totalCount,
      hasMore: skip !== undefined && pageSize !== undefined ? skip + pageSize < totalCount : false,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
        products: [],
      },
      { status: 500 }
    )
  }
}
