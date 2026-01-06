import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import ReelSection from './components/ReelSection'
import FeaturedWork from './components/FeaturedWork'
import ConnectingSection from './components/ConnectingSection'
import AstronautFullscreen from './pages/AstronautFullscreen'
import AboutUs from './pages/AboutUs'
import LiquidDistortion from './components/LiquidDistortion'
import PageLoader from './components/PageLoader'

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

function AppContent() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    // Show loader on route change
    setIsLoading(true)
    setShowContent(false)
    window.scrollTo(0, 0)
  }, [location.pathname])

  const handleLoaderComplete = () => {
    setIsLoading(false)
    setShowContent(true)
  }

  return (
    <>
      {/* Liquid distortion effect */}
      <LiquidDistortion />

      {/* Page loader */}
      {isLoading && <PageLoader onComplete={handleLoaderComplete} />}

      {/* Content */}
      {showContent && (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/astronaut" element={<AstronautFullscreen />} />
        </Routes>
      )}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App