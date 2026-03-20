// src/content/seo.ts
import type { Metadata, Viewport } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://example.com'

export const seo = {
  siteUrl: SITE_URL,
  siteName: 'Evolve',
  title: 'Evolve',
  titleTemplate: '%s | Evolve',
  description:
    'A production stack on Celestia for teams building systems that need deterministic processing, policy controls, and always-on operations without being a tenant on shared chains.',
  locale: 'en_US',
  ogImage: {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Evolve'
  },
  twitter: {
    card: 'summary_large_image' as const,
    // Put your handle here later, e.g. '@your_handle'
    site: undefined as string | undefined
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F3F4F4',
  colorScheme: 'light'
}

export function createMetadata(): Metadata {
  const base = new URL(seo.siteUrl)

  return {
    metadataBase: base,
    applicationName: seo.siteName,

    title: {
      default: seo.title,
      template: seo.titleTemplate
    },
    description: seo.description,

    alternates: {
      canonical: '/'
    },

    icons: {
      icon: [
        { url: '/favicon/favicon.ico' },
        { url: '/favicon/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
      ],
      apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
      shortcut: ['/favicon/favicon.ico']
    },

    openGraph: {
      type: 'website',
      url: seo.siteUrl,
      siteName: seo.siteName,
      locale: seo.locale,
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.ogImage.url,
          width: seo.ogImage.width,
          height: seo.ogImage.height,
          alt: seo.ogImage.alt
        }
      ]
    },

    twitter: {
      card: seo.twitter.card,
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage.url],
      site: seo.twitter.site
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1
      }
    },

    verification: {
      // Set these in env when you have them:
      // NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...
      // NEXT_PUBLIC_YANDEX_VERIFICATION=...
      // NEXT_PUBLIC_BING_VERIFICATION=...
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { bing: process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : undefined
    }
  }
}

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: seo.siteName,
  url: seo.siteUrl
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: seo.siteName,
  url: seo.siteUrl,
  logo: new URL('/evolve-logo.svg', seo.siteUrl).toString()
}
