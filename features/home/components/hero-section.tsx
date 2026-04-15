/**
 * Hero Section - Server Component
 */
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Verified } from 'lucide-react'
import { ROUTES, APP_NAME } from '@/config/constants'

export function HeroSection() {
  return (
    <section className="relative bg-background dark:bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(rgb(29 53 87) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col-reverse lg:flex-row items-center min-h-[500px] lg:min-h-[600px]">
          <div className="w-full lg:w-1/2 px-6 py-8 lg:py-0 lg:pr-12 relative z-10 lg:-mt-12">
            <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900 dark:text-white">
              Elegance In <br />
              Every <span className="text-primary relative inline-block">
                Threads
                <svg 
                  className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" 
                  preserveAspectRatio="none" 
                  viewBox="0 0 100 10"
                >
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="8" />
                </svg>
              </span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={ROUTES.PRODUCTS}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto px-8 py-6 bg-primary hover:bg-red-700 text-white font-medium shadow-lg shadow-red-500/30"
                >
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-1/2 h-[500px] lg:h-[700px] relative">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-background dark:from-background via-transparent to-transparent z-10 lg:w-24" /> */}
            <Image
              src="/fashion-clothing-store-hero-image.jpg"
              alt={`${APP_NAME} Fashion`}
              fill
              className="object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
