import LegalPage from '@/components/ui/organisms/LegalPage'
import EcosystemSection from '@/components/ui/sections/EcosystemSection'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Review the terms that govern the use of our website and services.',
  robots: {
    index: false,
    follow: true
  }
}

export default function TermsAndConditionsPage() {
  return (
    <>
      <LegalPage fileName="terms-and-conditions.md" />
      <EcosystemSection />
    </>
  )
}
