import type { Metadata } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import './globals.css'
import { createMetadata, viewport, organizationJsonLd, websiteJsonLd } from '@/content/seo'
import { RootProvider } from 'fumadocs-ui/provider/next'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = createMetadata()
export { viewport }

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body>
        <RootProvider theme={{ enabled: false }}>{children}</RootProvider>
        <Script defer data-domain="ev.xyz" src="https://plausible.celestia.org/js/plausible.js" />
      </body>
    </html>
  )
}
