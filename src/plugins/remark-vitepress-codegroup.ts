import type { Root, Code } from 'mdast'
import type { ContainerDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that converts VitePress :::code-group containers
 * into Fumadocs <Tabs> + <Tab> components.
 *
 * Input:
 * :::code-group
 * ```sh [Arabica]
 * some code
 * ```
 * ```sh [Mocha]
 * some code
 * ```
 * :::
 *
 * Output: JSX <Tabs groupId="..."><Tab value="Arabica">...</Tab>...</Tabs>
 */
export function remarkVitepressCodeGroup() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: ContainerDirective, index, parent) => {
      if (node.name !== 'code-group' || !parent || index === undefined) return

      const tabs: { label: string; code: Code }[] = []

      for (const child of node.children) {
        if (child.type === 'code') {
          // Extract tab label from meta, e.g. "sh [Arabica]" -> "Arabica"
          const metaMatch = child.meta?.match(/\[([^\]]+)\]/)
          const label = metaMatch ? metaMatch[1] : child.lang || 'Code'
          tabs.push({ label, code: child })
        }
      }

      if (tabs.length === 0) return

      // Create a deterministic groupId from sorted tab labels for cross-page syncing
      const sortedLabels = [...tabs.map((t) => t.label)].sort()
      const groupId = sortedLabels
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '')

      // Build JSX AST for <Tabs> with <Tab> children
      const tabItems = tabs.map((tab) => ({
        type: 'mdxJsxFlowElement' as const,
        name: 'Tab',
        attributes: [{ type: 'mdxJsxAttribute' as const, name: 'value', value: tab.label }],
        children: [tab.code],
        data: { _mdxExplicitJsx: true }
      }))

      const tabsNode = {
        type: 'mdxJsxFlowElement' as const,
        name: 'Tabs',
        attributes: [
          { type: 'mdxJsxAttribute' as const, name: 'groupId', value: groupId },
          {
            type: 'mdxJsxAttribute' as const,
            name: 'items',
            value: {
              type: 'mdxJsxAttributeValueExpression' as const,
              value: JSON.stringify(tabs.map((t) => t.label)),
              data: {
                estree: {
                  type: 'Program',
                  sourceType: 'module',
                  body: [
                    {
                      type: 'ExpressionStatement',
                      expression: {
                        type: 'ArrayExpression',
                        elements: tabs.map((t) => ({
                          type: 'Literal',
                          value: t.label
                        }))
                      }
                    }
                  ]
                }
              }
            }
          }
        ],
        children: tabItems,
        data: { _mdxExplicitJsx: true }
      }

      // Replace the directive node with the Tabs node
      parent.children[index] = tabsNode as unknown as typeof node
    })
  }
}
