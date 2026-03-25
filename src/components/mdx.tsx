import type { MDXComponents } from 'mdx/types'
import defaultComponents from 'fumadocs-ui/mdx'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import { createAPIPage } from 'fumadocs-openapi/ui'
import { openapi } from '@/lib/source'
import { MermaidDiagram } from '@/components/docs/MermaidDiagram'
import { CelestiaGasEstimator } from '@/components/docs/CelestiaGasEstimator'

// remarkMdxMermaid converts ```mermaid blocks to <Mermaid chart="..." />
function Mermaid({ chart }: { chart: string }) {
  return <MermaidDiagram chart={chart} />
}

const APIPage = createAPIPage(openapi)

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultComponents,
    Tabs,
    Tab,
    Mermaid,
    CelestiaGasEstimator,
    APIPage,
    ...components
  }
}
