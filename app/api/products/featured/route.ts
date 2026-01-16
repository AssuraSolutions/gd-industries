import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/products/featured
 * Fetch all featured products from database
 */
export async function GET() {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: {
        featured: true,
        inStock: true, // Only show in-stock featured products
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8, // Limit to 8 featured products
    })

    return NextResponse.json({
      success: true,
      products: featuredProducts,
      count: featuredProducts.length,
    })
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch featured products',
        products: [],
      },
      { status: 500 }
    )
  }
}
