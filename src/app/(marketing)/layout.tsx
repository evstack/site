import type { ReactNode } from 'react'
import Header from '@/components/ui/organisms/Header'

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}
