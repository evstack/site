import type { ReactNode } from 'react'
import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/lib/layout.shared'
import { DocsFooter } from '@/components/docs/DocsFooter'
import { SidebarHomeLink } from '@/components/docs/SidebarHomeLink'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      sidebar={{
        banner: (
          <div key="sidebar-banner">
            <SidebarHomeLink />
            <hr className="border-fd-border mt-2" />
          </div>
        ),
        footer: <DocsFooter />
      }}
      tabs={{
        transform(option, node) {
          if (!node.icon) return option
          return {
            ...option,
            icon: (
              <div className="[&_svg]:size-full rounded-lg size-full text-fd-primary">
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
