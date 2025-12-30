import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ReelSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const playTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Video container fades in and scales up from small
      gsap.fromTo(
        videoContainerRef.current,
        {
          opacity: 0,
          scale: 0.7,
        },
        {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: 1,
          },
          ease: 'power2.out',
        }
      )

      // PLAY REEL text fades in after video is visible
      gsap.fromTo(
        playTextRef.current,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'center center',
            scrub: 1,
          },
          ease: 'power3.out',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] flex items-center justify-center overflow-hidden"
    >
      {/* Video Container */}
      <div
        ref={videoContainerRef}
        className="relative w-full h-screen rounded-[2rem] overflow-hidden"
        style={{
          maxWidth: '1750px',
          maxHeight: '820px',
          background: 'linear-gradient(135deg, #5B8DEF 0%, #0F6FFF 100%)',
        }}
      >
        {/* Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source
            src="https://videos.pexels.com/video-files/3130284/3130284-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>

        {/* Blue overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'rgba(0, 68, 255, 0.3)',
            mixBlendMode: 'multiply',
          }}
        />

        {/* PLAY REEL Overlay */}
        <div
          ref={playTextRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            {/* Play Button */}
            <button className="group mb-8 w-28 h-28 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 shadow-2xl">
              <svg
                className="w-12 h-12 text-[#0044ff] ml-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            {/* PLAY REEL Text */}
            <div className="flex items-center justify-center gap-8">
              <h2 className="text-white text-[10rem] font-bold tracking-wider leading-none" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                PLAY
              </h2>
              <h2 className="text-white text-[10rem] font-bold tracking-wider leading-none" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                REEL
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Plus signs decoration */}
      <div className="absolute top-32 left-16 text-4xl text-black">+</div>
      <div className="absolute top-32 left-1/4 text-4xl text-black">+</div>
      <div className="absolute top-32 right-1/4 text-4xl text-black">+</div>
      <div className="absolute top-32 right-16 text-4xl text-black">+</div>
      
      <div className="absolute bottom-32 left-16 text-4xl text-black">+</div>
      <div className="absolute bottom-32 left-1/4 text-4xl text-black">+</div>
      <div className="absolute bottom-32 right-1/4 text-4xl text-black">+</div>
      <div className="absolute bottom-32 right-16 text-4xl text-black">+</div>
    </section>
  )
}