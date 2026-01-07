import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AwardItem {
  organization: string
  count: string
  description: string
}

interface ArticleItem {
  title: string
  url: string
}

interface TalkItem {
  title: string
  date: string
  location: string
}

const awardsData: AwardItem[] = [
  { organization: 'Awwwards', count: '001', description: 'Site of the Year' },
  { organization: '', count: '001', description: 'Developer Site of the Year' },
  { organization: '', count: '001', description: 'Site of the Month' },
  { organization: '', count: '010', description: 'Site of the Day' },
  { organization: '', count: '016', description: 'Honorable Mention' },
]

const fwaData: AwardItem[] = [
  { organization: 'FWA', count: '001', description: 'Site of the Year' },
  { organization: '', count: '002', description: 'Site of the Month' },
  { organization: '', count: '017', description: 'Site of the Day' },
]

const cssdaData: AwardItem[] = [
  { organization: 'CSSDA', count: '001', description: 'Site of the Year' },
  { organization: '', count: '001', description: 'Agency Site of the Year' },
]

const webbyData: AwardItem[] = [
  { organization: 'Webby Awards', count: '002', description: 'Webby Winner' },
  { organization: '', count: '002', description: 'Webby Nominee' },
]

const lovieData: AwardItem[] = [
  { organization: 'Lovie Awards', count: '001', description: 'Lovie Winner' },
]

const drumData: AwardItem[] = [
  { organization: 'Drum Awards', count: '001', description: 'The Drum Awards for Design' },
]

const commArtsData: AwardItem[] = [
  { organization: 'CommArts', count: '001', description: 'Best-in-show Interactive' },
]

const articlesData: ArticleItem[] = [
  { title: 'Porsche Newsroom - Driven By Dream', url: '#' },
  { title: 'Wallpaper - Driven by Dreams', url: '#' },
  { title: 'Opera North - The Turn of the Screw', url: '#' },
]

const talksData: TalkItem[] = [
  { title: 'Digital Design Days', date: 'Oct 2024', location: 'Milan' },
  { title: 'Awwwards Conf', date: 'Oct 2023', location: 'Amsterdam' },
  { title: 'KIKK Festival', date: 'Oct 2023', location: 'Namur' },
  { title: 'Awwwards Conf', date: 'Oct 2022', location: 'Amsterdam' },
  { title: 'Grow Paris', date: 'Nov 2018', location: 'Paris' },
]

// Mouse trail with glow
function MouseTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const trails = useRef<Array<{ x: number; y: number; life: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      trails.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1.0
      })
    }

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      trails.current = trails.current.filter(trail => {
        trail.life -= 0.015
        
        if (trail.life > 0) {
          const gradient = ctx.createRadialGradient(
            trail.x, trail.y, 0,
            trail.x, trail.y, 200 * trail.life
          )
          
          gradient.addColorStop(0, `rgba(240, 241, 250, ${0.9 * trail.life})`)
          gradient.addColorStop(0.4, `rgba(138, 50, 247, ${0.4 * trail.life})`)
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
          
          ctx.fillStyle = gradient
          ctx.fillRect(trail.x - 200, trail.y - 200, 400, 400)
          
          return true
        }
        return false
      })

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'lighten' }}
    />
  )
}

// Rotating icon
function RotatingIcon({ type, rotation }: { type: 'star' | 'sparkle' | 'grid'; rotation: number }) {
  if (type === 'star') {
    return (
      <svg className="w-9 h-9" xmlns="http://www.w3.org/2000/svg" width="36" height="37" fill="none" viewBox="0 0 36 37" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear' }}>
        <path fill="#f0f1fa" d="M15.189 1.678a3.976 3.976 0 0 1 6.624 3.939L18 18.514 14.187 5.617a3.976 3.976 0 0 1 1.002-3.939Z" />
        <path fill="#f0f1fa" d="M27.916 4.621a3.976 3.976 0 0 1 1.9 7.47L18 18.513l6.423-11.816a3.976 3.976 0 0 1 3.494-2.077ZM34.836 15.702a3.976 3.976 0 0 1-3.94 6.624L18 18.514 30.897 14.7a3.976 3.976 0 0 1 3.939 1.001Z" />
        <path fill="#f0f1fa" d="M31.892 28.43a3.976 3.976 0 0 1-7.469 1.9L18 18.513l11.816 6.423a3.976 3.976 0 0 1 2.076 3.493ZM20.811 35.35a3.976 3.976 0 0 1-6.624-3.94L18 18.514l3.813 12.896a3.976 3.976 0 0 1-1.002 3.94ZM8.083 32.406a3.976 3.976 0 0 1-1.899-7.469L18 18.514l-6.423 11.815a3.976 3.976 0 0 1-3.494 2.077ZM1.165 21.325a3.976 3.976 0 0 1 3.938-6.624L18 18.514 5.103 22.327a3.976 3.976 0 0 1-3.938-1.002ZM4.108 8.597a3.976 3.976 0 0 1 7.469-1.899L18 18.514 6.184 12.09a3.976 3.976 0 0 1-2.076-3.493Z" />
      </svg>
    )
  }

  if (type === 'sparkle') {
    return (
      <svg className="w-9 h-9" xmlns="http://www.w3.org/2000/svg" width="36" height="37" fill="none" viewBox="0 0 36 37" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear' }}>
        <path fill="#f0f1fa" d="M0 18.277c0-.663.456-1.236 1.092-1.426A22.73 22.73 0 0 0 16.337 1.605C16.527.97 17.1.514 17.764.514h.472c.664 0 1.237.455 1.427 1.091a22.73 22.73 0 0 0 15.245 15.246c.636.19 1.092.763 1.092 1.427v.472c0 .663-.456 1.237-1.092 1.426a22.73 22.73 0 0 0-15.245 15.246c-.19.636-.763 1.092-1.427 1.092h-.472c-.664 0-1.237-.456-1.427-1.092A22.73 22.73 0 0 0 1.092 20.176C.456 19.986 0 19.414 0 18.75v-.473Z" />
      </svg>
    )
  }

  return (
    <svg className="w-9 h-9" xmlns="http://www.w3.org/2000/svg" width="36" height="37" fill="none" viewBox="0 0 36 37" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.05s linear' }}>
      <path fill="#f0f1fa" fillRule="evenodd" d="M0 5.07a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm13.5 0a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm18-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM0 18.57a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm18-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm9 4.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm-22.5 9a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm9 4.5a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Zm18-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" clipRule="evenodd" />
    </svg>
  )
}

// Category section with huge header
function CategorySection({
  title,
  backgroundText,
  icon,
  count,
  children
}: {
  title: string
  backgroundText: string
  icon: 'star' | 'sparkle' | 'grid'
  count: string
  children: React.ReactNode
}) {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative py-20 sm:py-24 md:py-32">
      {/* Background text with holographic gradient */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div 
          className="text-[20vw] font-bold leading-none tracking-tighter text-center uppercase"
          style={{ 
            fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
            color: 'transparent',
            WebkitTextStroke: '2px rgba(240, 241, 250, 0.12)',
            backgroundImage: 'linear-gradient(45deg, #ff00ff 0%, #00ffff 25%, #ffff00 50%, #00ff00 75%, #ff00ff 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            opacity: 0.15,
          } as React.CSSProperties}
        >
          {backgroundText}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-20 px-8 sm:px-12 md:px-16 lg:px-20 mb-12 sm:mb-16">
        <div className="flex items-start justify-between">
          <h2 className="text-[10vw] sm:text-[7vw] md:text-[5vw] font-light leading-none tracking-tight text-[#f0f1fa]">
            {title}
          </h2>
          
          <div className="flex items-center gap-4 pt-2 sm:pt-4">
            <RotatingIcon type={icon} rotation={rotation} />
            <p className="text-4xl sm:text-5xl md:text-6xl font-light text-[#f0f1fa]">{count}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20">
        {children}
      </div>
    </div>
  )
}

export default function AwardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="relative bg-black text-[#f0f1fa] overflow-hidden">
      <MouseTrailCanvas />

      {/* Awards */}
      <CategorySection title="Awards" backgroundText="AWWWARDS" icon="star" count="58">
        {[awardsData, fwaData, cssdaData, webbyData, lovieData, drumData, commArtsData].map((dataSet, setIndex) => (
          <div key={setIndex}>
            {dataSet.map((item, index) => (
              <div key={index} className="px-8 sm:px-12 md:px-16 lg:px-20 py-6 border-t border-gray-800/20 hover:bg-white/5 transition-colors cursor-pointer">
                <div className="grid grid-cols-3 gap-8 text-[#f0f1fa]">
                  <p className="text-base sm:text-lg font-light">{item.organization}</p>
                  <p className="text-base sm:text-lg font-light">{item.count}</p>
                  <p className="text-base sm:text-lg font-light">{item.description}</p>
                </div>
              </div>
            ))}
            {setIndex < 6 && <div className="h-8" />}
          </div>
        ))}
      </CategorySection>

      {/* Articles */}
      <CategorySection title="Articles" backgroundText="ARTICLES" icon="sparkle" count="03">
        {articlesData.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 px-8 sm:px-12 md:px-16 lg:px-20 py-8 border-t border-gray-800/20 hover:bg-white/5 transition-colors group"
          >
            <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" width="16" height="17" fill="none">
              <path fill="#f0f1fa" fillRule="evenodd" d="M2.3 15.586a.75.75 0 1 1-1.06-1.06L12.418 3.347H4.261a.75.75 0 1 1 0-1.5h10.715v10.715a.75.75 0 1 1-1.5 0V4.41L2.3 15.586Z" clipRule="evenodd" />
            </svg>
            <p className="text-base sm:text-lg font-light text-[#f0f1fa] group-hover:text-[#8832f7] transition-colors">{article.title}</p>
          </a>
        ))}
      </CategorySection>

      {/* Talks */}
      <CategorySection title="Talks" backgroundText="TALKS" icon="grid" count="5">
        {talksData.map((talk, index) => (
          <div key={index} className="flex items-center gap-4 px-8 sm:px-12 md:px-16 lg:px-20 py-8 border-t border-gray-800/20 hover:bg-white/5 transition-colors cursor-pointer">
            <svg className="w-4 h-4 opacity-60 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" width="16" height="17" fill="none">
              <path fill="#f0f1fa" fillRule="evenodd" d="M2.3 15.586a.75.75 0 1 1-1.06-1.06L12.418 3.347H4.261a.75.75 0 1 1 0-1.5h10.715v10.715a.75.75 0 1 1-1.5 0V4.41L2.3 15.586Z" clipRule="evenodd" />
            </svg>
            <p className="text-base sm:text-lg font-light text-[#f0f1fa] flex-1">{talk.title}</p>
            <p className="text-base sm:text-lg font-light text-gray-500">{talk.date} {talk.location}</p>
          </div>
        ))}
      </CategorySection>
    </section>
  )
}