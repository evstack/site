import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightOpenAPI, { openAPISidebarGroups } from 'starlight-openapi'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import remarkDirective from 'remark-directive'
import { remarkAdmonitionMap } from './src/plugins/remark-admonition'
import { remarkStripTextDirectives } from './src/plugins/remark-strip-text-directives'
import { remarkVitepressCodeGroup } from './src/plugins/remark-vitepress-codegroup'
import { remarkTemplateVars } from './src/plugins/remark-template-vars'
import { remarkStripMdLinks } from './src/plugins/remark-strip-md-links'
import { remarkMdxMermaid } from './src/plugins/remark-mdx-mermaid'

export default defineConfig({
  site: 'https://evolve.com',
  output: 'static',

  integrations: [
    starlight({
      title: 'Evolve',
      plugins: [
        starlightOpenAPI([
          {
            base: 'api/rpc',
            schema: './public/docs/openapi-rpc.json'
          }
        ])
      ],
      logo: {
        light: './public/evolve-logo.svg',
        dark: './public/evolve-logo-dark.svg'
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/evstack' },
        { icon: 'x.com', label: 'Twitter', href: 'https://x.com/evstack' }
      ],
      editLink: {
        baseUrl: 'https://github.com/evstack/docs/edit/main/'
      },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Learn',
          autogenerate: { directory: 'learn' }
        },
        {
          label: 'Getting Started',
          autogenerate: { directory: 'getting-started' }
        },
        {
          label: 'How To Guides',
          autogenerate: { directory: 'guides' }
        },
        {
          label: 'API Documentation',
          items: [
            { slug: 'api' },
            ...openAPISidebarGroups
          ]
        },
        {
          label: 'Reference',
          autogenerate: { directory: 'reference' }
        },
        {
          label: 'Concepts',
          autogenerate: { directory: 'concepts' }
        },
        {
          label: 'Overview',
          autogenerate: { directory: 'overview' }
        },
        {
          label: 'EV-ABCI',
          autogenerate: { directory: 'ev-abci' }
        },
        {
          label: 'EV-Reth',
          autogenerate: { directory: 'ev-reth' }
        },
        {
          label: 'ADR',
          collapsed: true,
          autogenerate: { directory: 'adr' }
        }
      ],
      customCss: ['./src/styles/global.css'],
      components: {
        // Override to inject custom MDX components (Mermaid, CelestiaGasEstimator)
      },
      head: [
        // Plausible analytics
        {
          tag: 'script',
          attrs: {
            defer: true,
            'data-domain': 'evolve.com',
            src: 'https://plausible.celestia.org/js/plausible.js'
          }
        }
      ],
      disable404Route: true
    }),
    react(),
    sitemap()
  ],

  markdown: {
    remarkPlugins: [
      // Must run before Starlight's built-in admonition processing
      remarkDirective,
      remarkAdmonitionMap,
      remarkStripTextDirectives,
      remarkVitepressCodeGroup,
      remarkTemplateVars,
      remarkStripMdLinks,
      remarkMdxMermaid
    ]
  }
})
