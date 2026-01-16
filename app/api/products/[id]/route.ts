import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const dynamicParams = true

/**
 * GET /api/products/[id]
 * Fetch a single product by ID or slug
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })

    // If not found by ID, try slug
    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: {
          category: true,
        },
      })
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: 'Product not found',
          product: null,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch product',
        product: null,
      },
      { status: 500 }
    )
  }
}
