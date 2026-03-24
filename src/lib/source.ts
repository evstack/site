import { loader } from 'fumadocs-core/source'
import { docs } from '@/.source/server'
import { createOpenAPI, openapiPlugin } from 'fumadocs-openapi/server'
import { lucideIconsPlugin } from 'fumadocs-core/source/lucide-icons'
import { join } from 'path'

export const openapi = createOpenAPI({
  input: [join(process.cwd(), 'public/docs/openapi-rpc.json')]
})

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), openapiPlugin()]
})
