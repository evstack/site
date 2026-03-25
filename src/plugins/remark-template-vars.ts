import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'
import { docsConstants } from '../lib/docs-constants'

/**
 * Remark plugin that replaces %variableName% markers in code block text
 * with values from docs-constants.ts.
 */
export function remarkTemplateVars() {
  return (tree: Root) => {
    visit(tree, 'code', (node) => {
      if (typeof node.value === 'string' && node.value.includes('%')) {
        node.value = node.value.replace(/%(\w+)%/g, (match, key: string) => {
          return docsConstants[key] ?? match
        })
      }
    })
  }
}
