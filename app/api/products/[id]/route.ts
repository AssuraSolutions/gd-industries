import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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

    const product = await prisma.product.findFirst({
      where: {
        publish: true,
        category: {
          publish: true,
          OR: [
            { parentId: null },
            { parent: { publish: true } },
          ],
        },
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
      },
    })

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
