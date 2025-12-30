import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useRef, useState } from 'react'
import Scene3D from './Scene3D'
import gsap from 'gsap'

export default function Hero() {
  const titleRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isTalkHovered, setIsTalkHovered] = useState(false)
  const [isMenuHovered, setIsMenuHovered] = useState(false)

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
      {/* Header - Transparent Background */}
      <header className="fixed top-0 left-0 right-0 z-50 px-16 py-8 flex items-center justify-between">
        <div className="text-5xl font-medium tracking-tight text-black">LUSION</div>
        <div className="flex items-center gap-6">
          {/* LET'S TALK Button */}
          <button
            className="relative px-8 py-3.5 bg-black text-white rounded-full text-xl font-medium overflow-hidden transition-all duration-300 hover:bg-[#0044ff]"
            onMouseEnter={() => setIsTalkHovered(true)}
            onMouseLeave={() => setIsTalkHovered(false)}
          >
            <span className="relative flex items-center gap-2">
              {/* Arrow - slides in from left */}
              <span
                className={`absolute left-0 transition-all duration-300 ${
                  isTalkHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
              >
                →
              </span>
              
              {/* Text - shifts right on hover */}
              <span
                className={`transition-all duration-300 ${
                  isTalkHovered ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                LET'S TALK
              </span>
              
              {/* Dot - hides on hover */}
              <span
                className={`w-2 h-2 rounded-full bg-white transition-all duration-300 ${
                  isTalkHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                }`}
              />
            </span>
          </button>

          {/* MENU Button */}
          <button
            className="relative px-8 py-3.5 text-xl font-medium text-black bg-gray-200 rounded-full flex items-center gap-2"
            onMouseEnter={() => setIsMenuHovered(true)}
            onMouseLeave={() => setIsMenuHovered(false)}
          >
            <span>MENU</span>
            
            {/* Dots Container */}
            <span className="relative flex items-center justify-center w-4 h-4">
              {/* Horizontal Dots (default state) */}
              <span
                className={`absolute flex gap-1 transition-all duration-300 ${
                  isMenuHovered ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
              </span>
              
              {/* Vertical Dots (hover state) */}
              <span
                className={`absolute flex flex-col gap-1 transition-all duration-300 ${
                  isMenuHovered ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
                <span className="w-1.5 h-1.5 rounded-full bg-black" />
              </span>
            </span>
          </button>
        </div>
      </header>

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