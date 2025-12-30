import { useEffect } from 'react'
import Astronaut3D from '../components/Astronaut3D'
import Header from '../components/Header'

export default function AstronautFullscreen() {
  useEffect(() => {
    // Prevent scroll on this page
    document.body.style.overflow = 'hidden'
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Fullscreen Astronaut */}
      <div className="absolute inset-0">
        <Astronaut3D />
      </div>
    </div>
  )
}