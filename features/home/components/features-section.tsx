/**
 * Features Section - Server Component
 */
import { Truck, Shield, Headphones } from 'lucide-react'
import { SHIPPING } from '@/config/constants'

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: `Free delivery on orders above Rs. ${SHIPPING.FREE_SHIPPING_THRESHOLD.toLocaleString()}`,
    colorClass: 'bg-primary/10 text-primary',
  },
  {
    icon: Shield,
    title: 'Quality Guarantee',
    description: 'Premium quality products with warranty',
    colorClass: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'WhatsApp support available anytime',
    colorClass: 'bg-accent/10 text-accent',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="text-center space-y-4">
                <div className={`w-16 h-16 ${feature.colorClass} rounded-full flex items-center justify-center mx-auto`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
