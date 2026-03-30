import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs')

  const lines = [
    '# Evolve Documentation',
    '',
    '> A sovereign rollup framework that enables developers to build rollups on any Data Availability (DA) layer.',
    '',
    '## Pages',
    ''
  ]

  for (const doc of docs) {
    const url = `https://evolve.com/docs/${doc.id}`
    const title = doc.data.title || doc.id
    const desc = doc.data.description ? `: ${doc.data.description}` : ''
    lines.push(`- [${title}](${url})${desc}`)
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
