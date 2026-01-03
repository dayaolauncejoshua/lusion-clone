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
    navigate('/astronaut')
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] py-16 sm:py-20 md:py-24 lg:py-32 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden"
    >
      {/* Decorative Cyan Curves */}
      <svg
        ref={curveRef1}
        className="absolute top-10 sm:top-14 md:top-16 lg:top-20 right-1/4 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[200px] sm:h-[267px] md:h-[333px] lg:h-[400px] pointer-events-none"
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
        className="absolute top-20 sm:top-28 md:top-32 lg:top-40 right-2 sm:right-6 md:right-8 lg:right-10 w-[200px] sm:w-[267px] md:w-[333px] lg:w-[400px] h-[300px] sm:w-[400px] md:h-[500px] lg:h-[600px] pointer-events-none"
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
      <div ref={headlineRef} className="mb-12 sm:mb-16 md:mb-20 lg:mb-32 max-w-6xl">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[8rem] font-normal leading-[1.1] text-black tracking-tight">
          Connecting Ideals to Uniquely Crafted Experiences
        </h2>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row items-start gap-8 sm:gap-10 md:gap-12 lg:gap-16">
        {/* Left Side - Device Mockup */}
        <div
          ref={deviceRef}
          className="relative w-full lg:w-[45%] flex-shrink-0 cursor-pointer group"
          onClick={handleDeviceClick}
        >
          <div
            className="relative bg-black rounded-2xl sm:rounded-3xl lg:rounded-[3rem] p-2 sm:p-3 lg:p-4 shadow-2xl transition-transform duration-300 group-hover:scale-105"
            style={{ aspectRatio: '4/3' }}
          >
            <div className="relative w-full h-full bg-gray-900 rounded-xl sm:rounded-2xl lg:rounded-[2.5rem] overflow-hidden">
              <Astronaut3D stage={1} tunnelProgress={0} showStickers={false} />
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-sm text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm font-medium">
              Click to explore
            </div>
          </div>
        </div>

        {/* Right Side - Content Text */}
        <div ref={contentRef} className="flex-1 pt-0 lg:pt-14 lg:pl-24">
          <div className="max-w-xl space-y-3 sm:space-y-4">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-black" style={{ lineHeight: '1.4' }}>
              At Lusion, we don't follow trends for the sake of it. We{' '}
              <span className="relative inline-block">
                believe
                <span className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 lg:h-2 bg-[#5DFDCB] opacity-40 -z-10"></span>
              </span>{' '}
              in a different approach - one that's{' '}
              <span className="relative inline-block">
                centered around
                <span className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 lg:h-2 bg-[#5DFDCB] opacity-40 -z-10"></span>
              </span>{' '}
              you, your audience, and the art of{' '}
              <span className="relative inline-block">
                creating
                <span className="absolute bottom-0 left-0 w-full h-1 sm:h-1.5 lg:h-2 bg-[#5DFDCB] opacity-40 -z-10"></span>
              </span>{' '}
              a memorable, personalized experience.
            </p>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-black" style={{ lineHeight: '1.8' }}>
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