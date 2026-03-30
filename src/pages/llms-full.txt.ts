import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs')

  const sections: string[] = []

  for (const doc of docs) {
    const url = `https://evolve.com/docs/${doc.id}`
    const title = doc.data.title || doc.id
    // Access raw body content
    const body = doc.body ?? ''
    sections.push(`# ${title} (${url})\n\n${body}`)
  }

  return new Response(sections.join('\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
