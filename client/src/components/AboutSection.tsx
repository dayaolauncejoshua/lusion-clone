import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const blueBoxRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const videos = [
    'https://www.pexels.com/download/video/19836663/',
    'https://www.pexels.com/download/video/35087112/',
    'https://www.pexels.com/download/video/35131909/',
    'https://www.pexels.com/download/video/3188958/',
    'https://www.pexels.com/download/video/10254613/',
  ]

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(1)

  const handleVideoEnd = () => {
    setVideoOpacity(0)
    setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
      setTimeout(() => {
        setVideoOpacity(1)
      }, 50)
    }, 500)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headline = headlineRef.current
      if (headline) {
        const lines = headline.querySelectorAll('.headline-line')
        
        gsap.from(lines, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            scrub: 1,
          },
          y: 120,
          opacity: 0,
          stagger: 0.15,
          ease: 'power3.out',
        })
      }

      gsap.to([headlineRef.current, contentRef.current, buttonRef.current], {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'bottom bottom+=200',
          end: 'bottom top+=200',
          scrub: 1,
        },
        opacity: 0,
        y: -30,
        ease: 'power2.in',
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
    >
      <div className="relative w-full px-4 sm:px-6 md:px-10 lg:px-16">
        {/* Large Headline */}
        <div ref={headlineRef} className="mb-6 sm:mb-8 md:mb-10 pl-0 sm:pl-8 md:pl-16 lg:pl-32">
          <div className="headline-line text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[10rem] font-normal leading-[0.85] text-black tracking-tight">
            Beyond Visions
          </div>
          <div className="headline-line text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[10rem] font-normal leading-[1.5] text-black tracking-tight">
            Within Reach
          </div>
        </div>

        {/* Content Container */}
        <div className="relative">
          {/* Top: Paragraph */}
          <div className="flex justify-start lg:justify-end mb-6 sm:mb-8 md:mb-10 lg:mb-0">
            <div ref={contentRef} className="max-w-3xl">
              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl leading-relaxed text-black" style={{ lineHeight: '1.5' }}>
                Lusion is a digital production studio that brings your ideas to life through
                visually captivating designs and interactive experiences. With our talented team,
                we push the boundaries by solving complex problems, delivering tailored solutions
                that exceed expectations and engage audiences.
              </p>
            </div>
          </div>

          {/* Bottom: Blue Box + Button */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Left Side - Blue Box */}
            <div className="w-full lg:w-1/2">
              <div
                ref={blueBoxRef}
                id="morphing-video-box"
                className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] overflow-hidden w-full"
                style={{ 
                  minHeight: '400px',
                  height: '450px',
                  background: 'linear-gradient(135deg, #5B8DEF 0%, #0F6FFF 100%)',
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ 
                    minHeight: '300px',
                    opacity: videoOpacity,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                  onEnded={handleVideoEnd}
                  key={currentVideoIndex}
                >
                  <source src={videos[currentVideoIndex]} type="video/mp4" />
                </video>
                
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'rgba(0, 68, 255, 0.5)',
                    mixBlendMode: 'multiply'
                  }}
                />
              </div>
            </div>

            {/* Right Side - About Us Button */}
            <div className="flex-1 flex justify-start lg:justify-start items-start lg:items-end lg:pb-8 lg:pt-10 lg:pl-16">
              <button
                ref={buttonRef}
                className="group relative flex items-center gap-2 sm:gap-3 px-5 sm:px-6 md:px-7 lg:px-8 py-3 sm:py-3.5 md:py-4 bg-white text-black rounded-full text-sm sm:text-base md:text-lg font-medium hover:bg-[#0044ff] hover:text-white transition-all duration-300 shadow-lg border border-gray-200 overflow-hidden"
              >
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-black rounded-full group-hover:opacity-0 group-hover:scale-0 transition-all duration-300" />
                <span className="group-hover:-translate-x-6 sm:group-hover:-translate-x-7 md:group-hover:-translate-x-8 transition-transform duration-300">
                  ABOUT US
                </span>
                <span className="absolute right-6 sm:right-7 md:right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xl sm:text-2xl font-bold">
                  →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}