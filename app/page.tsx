/**
 * Home page - Refactored with Server Components
 */
import { Suspense } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { HeroSection } from '@/features/home/components/hero-section'
import { FeaturesSection } from '@/features/home/components/features-section'
import { FeaturedProductsSection } from '@/features/home/components/featured-products-section'
import { CategoriesSection } from '@/features/home/components/categories-section'
import { ProductGridSkeleton } from '@/components/shared/loading-skeletons'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Featured Products */}
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <FeaturedProductsSection />
        </Suspense>

        {/* Categories */}
        <Suspense fallback={<div className="py-16" />}>
          <CategoriesSection />
        </Suspense>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
