// src/app/robots.ts
import type { MetadataRoute } from 'next'
import { seo } from '@/content/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/']
      }
    ],
    sitemap: new URL('/sitemap.xml', seo.siteUrl).toString()
  }
}
