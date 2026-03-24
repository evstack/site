import { source } from '@/lib/source'
import { DocsBody, DocsPage, EditOnGitHub, PageLastUpdate } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import type { Metadata } from 'next'

const EDIT_URL_BASE = 'https://github.com/evstack/docs/edit/main'

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const lastModified = page.data._exports.lastModified as Date | undefined
  const filePath = page.data.info.path

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} tableOfContent={{ style: 'clerk' }}>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
      <div className="flex flex-wrap items-center justify-between gap-4 empty:hidden">
        <EditOnGitHub href={`${EDIT_URL_BASE}/${filePath}`} />
        {lastModified && <PageLastUpdate date={lastModified} />}
      </div>
    </DocsPage>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) return {}

  const url = `/docs/${(params.slug ?? []).join('/')}`

  return {
    title: `${page.data.title} | Evolve Docs`,
    description: page.data.description,
    alternates: { canonical: url },
    openGraph: {
      title: `${page.data.title} | Evolve Docs`,
      description: page.data.description,
      url,
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${page.data.title} | Evolve Docs`,
      description: page.data.description
    }
  }
}
