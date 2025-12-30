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

  // Array of video sources
  const videos = [
    'https://www.pexels.com/download/video/19836663/', // People celebrating/dancing
    'https://www.pexels.com/download/video/35087112/', // Business people meeting/talking
    'https://www.pexels.com/download/video/35131909/', // Team working together
    'https://www.pexels.com/download/video/3188958/', // People in office/creative space
    'https://www.pexels.com/download/video/10254613/', // Group collaboration/meeting
  ]

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [videoOpacity, setVideoOpacity] = useState(1)

  const handleVideoEnd = () => {
    // Fade out
    setVideoOpacity(0)
    
    // After fade out, change video
    setTimeout(() => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length)
      // Fade in new video
      setTimeout(() => {
        setVideoOpacity(1)
      }, 50)
    }, 500)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
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

      // Content fades out as we approach transition
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
      className="relative min-h-screen bg-[#f5f5f5] py-32 overflow-hidden"
    >
      <div className="relative w-full px-16">
        {/* Large Headline */}
        <div ref={headlineRef} className="mb-10 pl-32">
          <div className="headline-line text-[10rem] font-normal leading-[0.85] text-black tracking-tight">
            Beyond Visions
          </div>
          <div className="headline-line text-[10rem] font-normal leading-[1.5] text-black tracking-tight">
            Within Reach
          </div>
        </div>

        {/* Content Container */}
        <div className="relative">
          {/* Top: Paragraph (Right aligned) */}
          <div className="flex justify-end">
            <div ref={contentRef} className="max-w-3xl">
              <p className="text-3xl leading-relaxed text-black" style={{ lineHeight: '1.5' }}>
                Lusion is a digital production studio that brings your ideas to life through
                visually captivating designs and interactive experiences. With our talented team,
                we push the boundaries by solving complex problems, delivering tailored solutions
                that exceed expectations and engage audiences.
              </p>
            </div>
          </div>

          {/* Bottom: Blue Box (Left) + About Us Button (Right) */}
          <div className="flex items-start justify-between gap-12">
            {/* Left Side - Blue Box */}
            <div className="w-1/2">
              <div
                ref={blueBoxRef}
                id="morphing-video-box"
                className="relative rounded-[2.5rem] overflow-hidden w-full"
                style={{ 
                  minHeight: '450px',
                  background: 'linear-gradient(135deg, #5B8DEF 0%, #0F6FFF 100%)',
                }}
              >
                {/* Video filling the entire box - plays in sequence with smooth transition */}
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ 
                    minHeight: '450px',
                    opacity: videoOpacity,
                    transition: 'opacity 0.5s ease-in-out'
                  }}
                  onEnded={handleVideoEnd}
                  key={currentVideoIndex}
                >
                  <source
                    src={videos[currentVideoIndex]}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                
                {/* Blue overlay to tint the video */}
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
            <div className="flex-1 flex justify-start items-end pb-8 pt-10 pl-16">
              <button
                ref={buttonRef}
                className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-[#0044ff] hover:text-white transition-all duration-300 shadow-lg border border-gray-200 overflow-hidden"
              >
                <span className="w-3 h-3 bg-black rounded-full group-hover:opacity-0 group-hover:scale-0 transition-all duration-300" />
                <span className="group-hover:-translate-x-8 transition-transform duration-300">
                  ABOUT US
                </span>
                <span className="absolute right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-2xl font-bold ">
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