// src/app/sitemap.ts
import type { MetadataRoute } from 'next'
import { seo } from '@/content/seo'
import { source } from '@/lib/source'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = seo.siteUrl
  const now = new Date()

  const docsPages = source.getPages().map((page) => ({
    url: new URL(page.url, base).toString(),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5
  }))

  return [
    {
      url: new URL('/', base).toString(),
      lastModified: now
    },
    ...docsPages
  ]
}
