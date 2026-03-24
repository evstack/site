import LegalPage from '@/components/ui/organisms/LegalPage'
import EcosystemSection from '@/components/ui/sections/EcosystemSection'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn about how we collect, use, and protect your personal information.',
  robots: {
    index: false,
    follow: true
  }
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalPage fileName="privacy-policy.md" />
      <EcosystemSection />
    </>
  )
}
