import { source } from '@/lib/source'
import { type NextRequest, NextResponse } from 'next/server'
import { notFound } from 'next/navigation'

export const revalidate = false

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params
  const page = source.getPage(slug)
  if (!page) notFound()

  const text = await page.data.getText('raw')

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/markdown'
    }
  })
}

export function generateStaticParams() {
  return source.generateParams()
}
