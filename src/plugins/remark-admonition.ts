import type { Root } from 'mdast'
import type { ContainerDirective } from 'mdast-util-directive'
import { visit } from 'unist-util-visit'

/**
 * Remark plugin that maps admonition directive names to Starlight's supported types.
 * Starlight natively handles :::note, :::tip, :::caution, :::danger.
 * This plugin renames non-standard types to their Starlight equivalents.
 *
 * Must run AFTER remark-directive but BEFORE Starlight's internal processing.
 */
const typeMap: Record<string, string> = {
  info: 'note',
  warn: 'caution',
  warning: 'caution',
  success: 'tip'
}

export function remarkAdmonitionMap() {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      const mapped = typeMap[node.name]
      if (mapped) {
        node.name = mapped
      }
    })
  }
}
