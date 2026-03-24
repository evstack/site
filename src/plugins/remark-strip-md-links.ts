import type { Root } from 'mdast'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that strips .md extensions from internal link hrefs.
 * Converts ./path.md -> ./path and ../path.md -> ../path
 */
export function remarkStripMdLinks() {
  return (tree: Root) => {
    visit(tree, 'link', (node) => {
      if (
        typeof node.url === 'string' &&
        node.url.endsWith('.md') &&
        !node.url.startsWith('http')
      ) {
        node.url = node.url.replace(/\.md$/, '')
      }
    })
  }
}
