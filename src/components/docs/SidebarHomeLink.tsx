'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard } from 'lucide-react'

export function SidebarHomeLink() {
  const pathname = usePathname()
  const isActive = pathname === '/docs'

  return (
    <Link
      href="/docs"
      className={`flex items-center gap-2 px-2 py-1.5 text-sm font-medium transition-colors rounded-md ${
        isActive
          ? 'text-fd-primary bg-fd-primary/10'
          : 'text-fd-muted-foreground hover:bg-fd-accent/50 hover:text-fd-accent-foreground/80'
      }`}
    >
      <LayoutDashboard className="size-4" />
      Overview
    </Link>
  )
}
