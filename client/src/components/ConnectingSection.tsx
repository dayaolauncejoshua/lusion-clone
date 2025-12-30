import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Astronaut3D from './Astronaut3D'

gsap.registerPlugin(ScrollTrigger)

export default function ConnectingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const curveRef1 = useRef<SVGSVGElement>(null)
  const curveRef2 = useRef<SVGSVGElement>(null)
  const deviceRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      gsap.from(headlineRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1,
        },
        y: 80,
        opacity: 0,
        ease: 'power3.out',
      })

      // Cyan curves animation
      gsap.from([curveRef1.current, curveRef2.current], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'top 30%',
          scrub: 1,
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.2,
        ease: 'power2.out',
      })

      // Device animation
      gsap.from(deviceRef.current, {
        scrollTrigger: {
          trigger: deviceRef.current,
          start: 'top 75%',
          end: 'top 45%',
          scrub: 1,
        },
        x: -100,
        opacity: 0,
        scale: 0.95,
        ease: 'power3.out',
      })

      // Content text animation
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1,
        },
        x: 60,
        opacity: 0,
        ease: 'power3.out',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleDeviceClick = () => {
    // Navigate with smooth transition
    navigate('/astronaut')
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] py-32 px-16 overflow-hidden"
    >
      {/* Decorative Cyan Curves */}
      <svg
        ref={curveRef1}
        className="absolute top-20 right-1/4 w-[600px] h-[400px] pointer-events-none"
        viewBox="0 0 600 400"
        fill="none"
      >
        <path
          d="M 50 200 Q 200 50, 400 150 T 550 200"
          stroke="#5DFDCB"
          strokeWidth="80"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <svg
        ref={curveRef2}
        className="absolute top-40 right-10 w-[400px] h-[600px] pointer-events-none"
        viewBox="0 0 400 600"
        fill="none"
      >
        <path
          d="M 200 50 Q 350 200, 300 400 T 200 550"
          stroke="#5DFDCB"
          strokeWidth="80"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Large Headline */}
      <div ref={headlineRef} className="mb-32 max-w-6xl">
        <h2 className="text-[8rem] font-normal leading-[1.1] text-black tracking-tight">
          Connecting Ideals to Uniquely Crafted Experiences
        </h2>
      </div>

      {/* Content Section */}
      <div className="flex items-start gap-16">
        {/* Left Side - Device Mockup with 3D Astronaut */}
        <div
          ref={deviceRef}
          className="relative w-[45%] flex-shrink-0 cursor-pointer group"
          onClick={handleDeviceClick}
        >
          {/* iPad/Tablet Mockup */}
          <div
            className="relative bg-black rounded-[3rem] p-4 shadow-2xl transition-transform duration-300 group-hover:scale-105"
            style={{ aspectRatio: '4/3' }}
          >
            {/* Screen */}
            <div className="relative w-full h-full bg-gray-900 rounded-[2.5rem] overflow-hidden">
              {/* 3D Astronaut Scene */}
              <Astronaut3D />
            </div>
          </div>
          
          {/* Click hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium">
              Click to explore
            </div>
          </div>
        </div>

        {/* Right Side - Content Text */}
        <div ref={contentRef} className="flex-1 pt-14 pl-24">
          <div className="max-w-xl space-y-4">
            <p className="text-3xl leading-relaxed text-black" style={{ lineHeight: '1.4' }}>
              At Lusion, we don't follow trends for the sake of it. We{' '}
              <span className="relative inline-block">
                believe
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#5DFDCB] opacity-40 -z-10"></span>
              </span>{' '}
              in a different approach - one that's{' '}
              <span className="relative inline-block">
                centered around
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#5DFDCB] opacity-40 -z-10"></span>
              </span>{' '}
              you, your audience, and the art of{' '}
              <span className="relative inline-block">
                creating
                <span className="absolute bottom-0 left-0 w-full h-2 bg-[#5DFDCB] opacity-40 -z-10"></span>
              </span>{' '}
              a memorable, personalized experience.
            </p>

            <p className="text-3xl leading-relaxed text-black" style={{ lineHeight: '1.8' }}>
              Our commitment goes beyond fleeting trends; it's about crafting
              tailor-made digital journeys that resonate uniquely and leave a
              lasting impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}