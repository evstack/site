import { source } from '@/lib/source'
import { DocsBody, DocsPage, EditOnGitHub, PageLastUpdate } from 'fumadocs-ui/page'
import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import type { Metadata } from 'next'

const EDIT_URL_BASE = 'https://github.com/evstack/docs/edit/main'
const GITHUB_BLOB_BASE = 'https://github.com/evstack/docs/blob/main'

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const lastModified = page.data._exports.lastModified as Date | undefined
  const filePath = page.data.info.path
  const markdownUrl = `/api/md/${page.slugs.join('/')}`
  const githubUrl = `${GITHUB_BLOB_BASE}/${filePath}`

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{
        style: 'clerk',
        header: (
          <div key="toc-actions" className="flex flex-row flex-wrap gap-2 items-center mb-9">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
            <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
          </div>
        )
      }}
    >
      {/* Mobile/tablet: show copy actions above title (hidden on xl where TOC has them) */}
      <div className="flex flex-row flex-wrap gap-2 items-center xl:hidden mb-4">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
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
