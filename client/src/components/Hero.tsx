import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import Scene3D from './Scene3D'
import Header from './Header'
import gsap from 'gsap'

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (titleRef.current && canvasRef.current) {
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.2,
      })
      gsap.to(canvasRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.4,
      })
    }
  }, [])

  return (
    <div className="relative w-full min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <Header />

      {/* Global mouse tracking overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{ cursor: 'none' }}
      />

      {/* Hero Content */}
      <div className="relative w-full min-h-screen flex flex-col items-center justify-center px-12 pt-16">
        {/* Title */}
        <div 
          ref={titleRef} 
          className="text-center mb-12 max-w-4xl opacity-0"
          style={{ transform: 'translateY(30px)' }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-[3rem] font-normal leading-tight text-black">
            We help brands create digital experiences that connect with their audience
          </h1>
        </div>

        {/* 3D Canvas Container */}
        <div 
          ref={canvasRef} 
          className="relative w-full max-w-[1750px] h-[820px] bg-black rounded-[2rem] overflow-hidden shadow-2xl opacity-0"
          style={{ transform: 'scale(0.95)' }}
        >
          <Canvas
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={[1, 2]}
          >
            <color attach="background" args={['#0a0a0a']} />
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
        </div>

        {/* Bottom Section - Plus Signs and Scroll Text Aligned */}
        <div className="relative w-full max-w-[1440px] mt-0">
          <div className="flex justify-between items-center px-0 py-1">
            <div className="text-black text-3xl font-bold">+</div>
            <div className="text-black text-3xl font-bold">+</div>
            <div className="text-center text-md tracking-[0.3em] text-black font-medium">
              SCROLL TO EXPLORE
            </div>
            <div className="text-black text-3xl font-bold">+</div>
            <div className="text-black text-3xl font-bold">+</div>
          </div>
        </div>
      </div>
    </div>
  )
}