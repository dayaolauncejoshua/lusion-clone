import { useEffect, useRef } from 'react'

const clientLogos = {
  cocacola: '/images/clients/coca-cola.svg',
  maxmara: '/images/clients/maxmara.svg',
  calvinKlein: '/images/clients/calvin-klein.svg',
  porsche: '/images/clients/porsche.svg',
  wallpaper: '/images/clients/wallpaper.svg',
  hyundai: '/images/clients/hyundai.svg',
  google: '/images/clients/google.svg',
  apple: '/images/clients/apple.svg',
  webbyAwards: '/images/clients/webby-awards.svg',
  stanford: '/images/clients/stanford.svg',
  sony: '/images/clients/sony.svg',
  awwwards: '/images/clients/awwwards.svg',
  nvidia: '/images/clients/nvidia.svg',
  akqa: '/images/clients/akqa.svg',
  nexusStudios: '/images/clients/nexus-studios.svg',
}

const row1Logos = [
  'wallpaper', 'cocacola', 'maxmara', 'calvinKlein', 'porsche',
  'wallpaper', 'cocacola', 'maxmara', 'calvinKlein', 'porsche',
  'wallpaper', 'cocacola', 'maxmara', 'calvinKlein', 'porsche',
]

const row2Logos = [
  'apple', 'sony', 'hyundai', 'google', 'webbyAwards', 'stanford',
  'apple', 'sony', 'hyundai', 'google', 'webbyAwards', 'stanford',
  'apple', 'sony', 'hyundai', 'google', 'webbyAwards', 'stanford',
]

const row3Logos = [
  'cocacola', 'awwwards', 'nvidia', 'akqa', 'nexusStudios',
  'cocacola', 'awwwards', 'nvidia', 'akqa', 'nexusStudios',
  'cocacola', 'awwwards', 'nvidia', 'akqa', 'nexusStudios',
]

interface MarqueeRowProps {
  logos: string[]
  speed: number
  direction?: 'left' | 'right'
}

function MarqueeRow({ logos, speed, direction = 'left' }: MarqueeRowProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return

    let position = 0
    let lastTimestamp = 0

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp
      const delta = timestamp - lastTimestamp
      lastTimestamp = timestamp

      const moveAmount = (speed * delta) / 1000
      position += direction === 'left' ? -moveAmount : moveAmount

      const firstChild = marquee.firstElementChild as HTMLElement
      if (!firstChild) return

      const childWidth = firstChild.offsetWidth
      const totalWidth = childWidth * logos.length

      if (direction === 'left' && position <= -totalWidth / 3) {
        position = 0
      } else if (direction === 'right' && position >= 0) {
        position = -totalWidth / 3
      }

      marquee.style.transform = `translateX(${position}px)`
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [logos.length, speed, direction])

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={marqueeRef}
        className="flex items-center will-change-transform gap-22 md:gap-30 lg:gap-38"
      >
        {logos.map((logoKey, index) => (
          <div 
            key={index}
            className="flex-shrink-0 flex items-center justify-center px-8 md:px-12"
          >
            <img 
              src={clientLogos[logoKey as keyof typeof clientLogos]}
              alt={logoKey}
              className="object-contain opacity-1 hover:opacity-100 transition-opacity duration-300"
              style={{ 
                height: '280px',
                width: 'auto',
                maxWidth: '350px',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ClientsSection() {
  return (
    <section className="relative bg-black text-white pt-60 pb-60 overflow-hidden">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="px-8 sm:px-12 md:px-16 lg:px-20 mb-18">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
            <h2 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight tracking-tight whitespace-nowrap"
              style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
            >
              CLIENTS WE WORK WITH
            </h2>

            <div className="lg:max-w-md lg:text-right self-end">
              <p 
                className="text-base md:text-md lg:text-md leading-tight tracking-wide"
                style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif' }}
              >
                WE CAN'T WAIT TO SHOW<br />
                YOU WHAT WE CAN DO FOR<br />
                YOU AND YOUR BRAND.
              </p>
            </div>
          </div>
        </div>

        {/* Marquee Container */}
        <div>
          <MarqueeRow logos={row1Logos} speed={60} />
          <MarqueeRow logos={row2Logos} speed={90} />
          <MarqueeRow logos={row3Logos} speed={60} />
        </div>
      </div>
    </section>
  )
}