import type { ReactNode } from 'react'
import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/lib/layout.shared'
import { DocsFooter } from '@/components/docs/DocsFooter'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{ footer: <DocsFooter /> }}
      tabs={{
        transform(option, node) {
          if (!node.icon) return option
          return {
            ...option,
            icon: (
              <div className="[&_svg]:size-full rounded-lg size-full text-fd-primary max-md:bg-fd-primary/10 max-md:border max-md:p-1.5">
                {node.icon}
              </div>
            )
          }
        }
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  )
}
