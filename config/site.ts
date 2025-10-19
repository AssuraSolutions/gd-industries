/**
 * Site configuration
 */

import type { Metadata } from 'next'
import { APP_NAME, APP_DESCRIPTION } from './constants'

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
  links: {
    facebook: 'https://facebook.com/gd-industries',
    instagram: 'https://instagram.com/gd-industries',
    twitter: 'https://twitter.com/gd-industries',
  },
  contact: {
    email: 'contact@gd-industries.com',
    phone: '+923001234567',
    address: 'Karachi, Pakistan',
  },
} as const

export const defaultMetadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['fashion', 'clothing', 'apparel', 'pakistan', 'online shopping'],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@gd_industries',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
