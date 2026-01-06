import ParticleHero from '../components/ParticleHero'
import Header from '../components/Header'
import ClientsSection from '../components/ClientsSection'

export default function AboutUs() {
  return (
    <div className="bg-black">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-[200]">
        <Header darkMode={true} />
      </div>

      {/* Fixed Particle Hero Section with scroll transitions */}
      <ParticleHero />

       {/* Normal scrollable content starts here */}
      <div className="relative z-30">
        <ClientsSection />
      </div>
    </div>
  )
}