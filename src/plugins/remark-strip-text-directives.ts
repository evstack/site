import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'

/**
 * Strips unrecognized text directives (e.g., `1:1` parsed as `:1` directive)
 * back into plain text. Only keeps container directives used by admonitions.
 */
export function remarkStripTextDirectives() {
  return (tree: Root) => {
    visit(tree, 'textDirective', (node, index, parent) => {
      if (index === undefined || !parent) return

      // Convert the directive back to plain text
      const textNode = {
        type: 'text' as const,
        value: `:${node.name}`
      }

      parent.children.splice(index, 1, textNode)
    })
  }
}
