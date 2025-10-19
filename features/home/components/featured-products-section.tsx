/**
 * Featured Products Section - Server Component
 */
import { Section } from '@/components/shared/section'
import { ProductCard } from '@/components/shared/product-card'
import { ProductGrid } from '@/components/shared/product-grid'
import { NoProducts } from '@/components/shared/empty-states'
import { getFeaturedProducts } from '@/services/product.service'

export async function FeaturedProductsSection() {
  const featuredProducts = await getFeaturedProducts()

  if (featuredProducts.length === 0) {
    return null
  }

  return (
    <Section
      title="Featured Products"
      description="Handpicked items from our latest collection"
      className="bg-background"
    >
      {featuredProducts.length > 0 ? (
        <ProductGrid>
          {featuredProducts.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </ProductGrid>
      ) : (
        <NoProducts />
      )}
    </Section>
  )
}
