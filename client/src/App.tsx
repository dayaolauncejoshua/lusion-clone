import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import ReelSection from './components/ReelSection'
import FeaturedWork from './components/FeaturedWork'
import ConnectingSection from './components/ConnectingSection'
import AstronautFullscreen from './pages/AstronautFullscreen'
import LiquidDistortion from './components/LiquidDistortion'

import './index.css'

function HomePage() {
  return (
    <div className="bg-[#f5f5f5]">
      <Hero />
      <AboutSection />
      <ReelSection />
      <FeaturedWork />
      <ConnectingSection />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>

    {/* Liquid distortion effect */}
      <LiquidDistortion />

      
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/astronaut" element={<AstronautFullscreen />} />
        </Routes>
      </PageTransition>
    </BrowserRouter>
  )
}

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return <div className="page-transition">{children}</div>
}

export default App