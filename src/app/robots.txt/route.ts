import { seo } from '@/content/seo'

export const revalidate = false

export function GET() {
  const base = seo.siteUrl

  const body = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${new URL('/sitemap.xml', base).toString()}
LLMs-Txt: ${new URL('/llms.txt', base).toString()}
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' }
  })
}
