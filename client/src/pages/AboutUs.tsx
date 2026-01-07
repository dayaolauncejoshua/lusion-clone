import { useState } from 'react'
import ParticleHero from '../components/ParticleHero'
import ClientsSection from '../components/ClientsSection'
import AwardsSection from '../components/AwardsSection'
import CapabilitySection from '../components/CapabilitySection'
import CTASection from '../components/CTASection'
import Header from '../components/Header'

export default function AboutUs() {
  const [showFooter, setShowFooter] = useState(false)

  return (
    <div className="relative">
      {/* Single Header at page level */}
      <div className="fixed top-0 left-0 right-0 z-[200]">
        <Header darkMode={!showFooter} />
      </div>

      <ParticleHero />
      <ClientsSection />
      <AwardsSection />
      <CapabilitySection />
      <CTASection onFooterChange={setShowFooter} />
    </div>
  )
}