import type { Root, Code } from 'mdast'
import type { ContainerDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that converts VitePress :::code-group containers
 * into Starlight <Tabs> + <TabItem> components, and auto-injects
 * the import statement.
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
 * Output: JSX <Tabs><TabItem label="Arabica">...</TabItem>...</Tabs>
 */
export function remarkVitepressCodeGroup() {
  return (tree: Root) => {
    let hasCodeGroup = false

    visit(tree, 'containerDirective', (node: ContainerDirective, index, parent) => {
      if (node.name !== 'code-group' || !parent || index === undefined) return

      hasCodeGroup = true
      const tabs: { label: string; code: Code }[] = []

      for (const child of node.children) {
        if (child.type === 'code') {
          const metaMatch = child.meta?.match(/\[([^\]]+)\]/)
          const label = metaMatch ? metaMatch[1] : child.lang || 'Code'
          tabs.push({ label, code: child })
        }
      }

      if (tabs.length === 0) return

      const tabItems = tabs.map((tab) => ({
        type: 'mdxJsxFlowElement' as const,
        name: 'TabItem',
        attributes: [{ type: 'mdxJsxAttribute' as const, name: 'label', value: tab.label }],
        children: [tab.code],
        data: { _mdxExplicitJsx: true }
      }))

      const tabsNode = {
        type: 'mdxJsxFlowElement' as const,
        name: 'Tabs',
        attributes: [],
        children: tabItems,
        data: { _mdxExplicitJsx: true }
      }

      parent.children[index] = tabsNode as unknown as typeof node
    })

    // Inject Starlight Tabs/TabItem import if code-groups were found
    if (hasCodeGroup) {
      tree.children.unshift({
        type: 'mdxjsEsm' as any,
        value: 'import { Tabs, TabItem } from "@astrojs/starlight/components"',
        data: {
          estree: {
            type: 'Program',
            sourceType: 'module',
            body: [
              {
                type: 'ImportDeclaration',
                source: { type: 'Literal', value: '@astrojs/starlight/components' },
                specifiers: [
                  {
                    type: 'ImportSpecifier',
                    imported: { type: 'Identifier', name: 'Tabs' },
                    local: { type: 'Identifier', name: 'Tabs' }
                  },
                  {
                    type: 'ImportSpecifier',
                    imported: { type: 'Identifier', name: 'TabItem' },
                    local: { type: 'Identifier', name: 'TabItem' }
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
