import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Standalone remark plugin that converts ```mermaid code blocks
 * into <Mermaid chart="..." /> MDX components, and auto-injects the
 * import statement for the MermaidDiagram React component.
 */
export function remarkMdxMermaid(options: { lang?: string } = {}) {
  const { lang = 'mermaid' } = options
  return (tree: Root) => {
    let hasMermaid = false

    visit(tree, 'code', (node) => {
      if (node.lang !== lang || !node.value) return
      hasMermaid = true
      Object.assign(node, {
        type: 'mdxJsxFlowElement',
        name: 'Mermaid',
        attributes: [
          {
            type: 'mdxJsxAttribute',
            name: 'chart',
            value: node.value.trim()
          }
        ],
        children: []
      })
    })

    // Inject import at the top of the file if any mermaid blocks were found
    if (hasMermaid) {
      tree.children.unshift({
        type: 'mdxjsEsm' as any,
        value: 'import { MermaidDiagram as Mermaid } from "@/components/docs/MermaidDiagram"',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ImportDeclaration',
                source: { type: 'Literal', value: '@/components/docs/MermaidDiagram' },
                specifiers: [
                  {
                    type: 'ImportSpecifier',
                    imported: { type: 'Identifier', name: 'MermaidDiagram' },
                    local: { type: 'Identifier', name: 'Mermaid' }
                  }
                ]
              }
            ]
          }
        }
      })
    }
  }
}
