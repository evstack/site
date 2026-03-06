// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { seo } from '@/content/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = seo.siteUrl
  const now = new Date()

  return [
    {
      url: new URL('/', base).toString(),
      lastModified: now
    }
  ]
}
