import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config'
import remarkDirective from 'remark-directive'
import { remarkDirectiveAdmonition, remarkMdxMermaid } from 'fumadocs-core/mdx-plugins'
import { remarkTemplateVars } from './src/plugins/remark-template-vars'
import { remarkVitepressCodeGroup } from './src/plugins/remark-vitepress-codegroup'
import { remarkStripMdLinks } from './src/plugins/remark-strip-md-links'
import { z } from 'zod'
import lastModified from 'fumadocs-mdx/plugins/last-modified'

export const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: frontmatterSchema.extend({
      title: z.string().optional().default(''),
      full: z.boolean().optional().default(false)
    }),
    postprocess: {
      includeProcessedMarkdown: true
    }
  }
})

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: (defaults) => [
      remarkDirective,
      remarkDirectiveAdmonition,
      remarkVitepressCodeGroup,
      remarkTemplateVars,
      remarkStripMdLinks,
      remarkMdxMermaid,
      ...defaults
    ]
  }
})
