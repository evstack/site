import HomeHeroSection from '@/components/ui/sections/HomeHeroSection'
import LogoSection from '@/components/ui/sections/LogoSection'
import ValuePropSection from '@/components/ui/sections/ValuePropSection'
import ArchitectureSection from '@/components/ui/sections/ArchitectureSection'
import UseCasesSection from '@/components/ui/sections/UseCasesSection'
import ComparisonSection from '@/components/ui/sections/ComparisonSection'
import EcosystemSection from '@/components/ui/sections/EcosystemSection'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HomeHeroSection />
      <LogoSection />
      <ValuePropSection />
      <ArchitectureSection />
      <UseCasesSection />
      <ComparisonSection />
      <EcosystemSection />
    </main>
  )
}
