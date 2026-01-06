import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface PageLoaderProps {
  onComplete: () => void
}

export default function PageLoader({ onComplete }: PageLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null)
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!loaderRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(onComplete, 300)
      }
    })

    tl.fromTo(
      letterRefs.current,
      {
        rotateX: -90,
        opacity: 0,
        y: -30,
      },
      {
        rotateX: 0,
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'back.out(2)',
      }
    )

    tl.to({}, { duration: 0.5 })

    tl.to(loaderRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.5,
      ease: 'power2.inOut',
    })

  }, [onComplete])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-black z-[500] flex items-center justify-center"
    >
      <div 
        className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-[0.3em] flex"
        style={{ perspective: '1000px', fontFamily: 'Helvetica, Arial, sans-serif' }}
      >
        {"LOADING".split('').map((char, i) => (
          <span
            key={i}
            ref={(el) => { letterRefs.current[i] = el }}
            className="inline-block"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}