import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/product-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { products, categories, offers } from "@/lib/data"
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react"

export default function HomePage() {
  const featuredProducts = products.filter((product) => product.featured)
  const activeOffers = offers.filter((offer) => offer.isActive)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 geometric-pattern">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-primary/20">Welcome to GD Industries</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-balance">
                Fashion That Defines
                <span className="text-primary"> Your Style</span>
              </h1>
              <p className="text-lg text-muted-foreground text-pretty">
                Discover our premium collection of clothing and accessories. Quality craftsmanship meets modern design
                for the discerning customer.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 triangle-pattern">
                <Image
                  src="/fashion-clothing-store-hero-image.jpg"
                  alt="GD Industries Fashion"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">Free delivery on orders above Rs. 3,000</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold">Quality Guarantee</h3>
              <p className="text-muted-foreground">Premium quality products with warranty</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">24/7 Support</h3>
              <p className="text-muted-foreground">WhatsApp support available anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Offers */}
      {activeOffers.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
              <p className="text-muted-foreground">Don't miss out on these amazing deals!</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeOffers.map((offer) => (
                <Card key={offer.id} className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {offer.discountType === "percentage"
                          ? `${offer.discountValue}% OFF`
                          : `Rs. ${offer.discountValue} OFF`}
                      </Badge>
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                    <p className="text-muted-foreground mb-4">{offer.description}</p>
                    <p className="text-sm text-muted-foreground">Valid until {offer.validTo.toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked items from our premium collection</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  )
}
