import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import gsap from 'gsap'
import Hero from './components/Hero'
import AboutSection from './components/AboutSection'
import ReelSection from './components/ReelSection'
import FeaturedWork from './components/FeaturedWork'
import ConnectingSection from './components/ConnectingSection'
import AstronautFullscreen from './pages/AstronautFullscreen'
import AboutUs from './pages/AboutUs'
import Projects from './pages/Projects'
import LiquidDistortion from './components/LiquidDistortion'
import PageLoader from './components/PageLoader'
import Footer from './components/Footer'
import Header from './components/Header'
import ProjectDetail from './pages/ProjectDetail'

import './index.css'

function HomePage() {
  const [showFooter, setShowFooter] = useState(false)
  const [footerProgress, setFooterProgress] = useState(0)

  // Listen for showFooter event from Menu
  useEffect(() => {
    const handleShowFooter = () => {
      if (!showFooter) {
        setShowFooter(true)
        gsap.to({}, {
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            setFooterProgress(this.progress())
          },
        })
      }
    }

    window.addEventListener('showFooter', handleShowFooter)
    
    return () => {
      window.removeEventListener('showFooter', handleShowFooter)
    }
  }, [showFooter])

  // Handle scroll up to close footer
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (showFooter && footerProgress === 1) {
        const footerElement = document.querySelector("footer")
        if (footerElement && e.deltaY < 0) {
          const isAtTop = footerElement.scrollTop === 0 || window.scrollY === 0

          if (isAtTop) {
            e.preventDefault()
            gsap.to({}, {
              duration: 1.5,
              ease: "power2.inOut",
              onUpdate: function () {
                setFooterProgress(1 - this.progress())
              },
              onComplete: () => {
                setShowFooter(false)
                setFooterProgress(0)
              },
            })
          }
        }
        return
      }

      if (showFooter && footerProgress < 1 && footerProgress > 0) {
        e.preventDefault()
        return
      }

      if (e.deltaY < 0 && showFooter && footerProgress < 1 && footerProgress > 0) {
        e.preventDefault()
        gsap.to({}, {
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            setFooterProgress(1 - this.progress())
          },
          onComplete: () => {
            setShowFooter(false)
            setFooterProgress(0)
          },
        })
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      window.removeEventListener("wheel", handleWheel)
    }
  }, [showFooter, footerProgress])

  return (
    <>
      {/* Header - always dark mode false (black text) for light backgrounds */}
      <div className="fixed top-0 left-0 right-0 z-[200]">
        <Header darkMode={false} />
      </div>

      <div className="bg-[#f5f5f5]">
        <Hero />
        <AboutSection />
        <ReelSection />
        <FeaturedWork />
        <ConnectingSection />
      </div>

      {/* Footer slides up from bottom */}
      {showFooter && (
        <div
          className="fixed inset-0 z-[150]"
          style={{
            transform: `translateY(${100 - footerProgress * 100}%)`,
            transition: footerProgress === 0 ? "none" : undefined,
          }}
        >
          <Footer />
        </div>
      )}
    </>
  )
}

function AppContent() {
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    // Skip loader for project detail pages
    const isProjectDetail = location.pathname.startsWith('/projects/') && location.pathname !== '/projects'
    
    if (isProjectDetail) {
      setIsLoading(false)
      setShowContent(true)
      window.scrollTo(0, 0)
      return
    }

    // Show loader on route change for other pages
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/astronaut" element={<AstronautFullscreen />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
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