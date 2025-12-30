import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation - slides up and fades in
      gsap.from(headlineRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1,
        },
        y: 100,
        opacity: 0,
        ease: 'power3.out',
      })

      // Description animation - slides from right
      gsap.from(descriptionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          end: 'top 35%',
          scrub: 1,
        },
        x: 60,
        opacity: 0,
        ease: 'power3.out',
      })

      // Project cards staggered animation
      const cards = cardsRef.current?.querySelectorAll('.project-card')
      if (cards) {
        cards.forEach((card, index) => {
          // Alternate between slide from left and right
          const xValue = index % 2 === 0 ? -80 : 80
          
          gsap.from(card, {
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              end: 'top 45%',
              scrub: 1,
            },
            x: xValue,
            opacity: 0,
            scale: 0.95,
            ease: 'power2.out',
          })

          // Image scale animation on scroll
          const cardImage = card.querySelector('.project-image')
          if (cardImage) {
            gsap.from(cardImage, {
              scrollTrigger: {
                trigger: card,
                start: 'top 70%',
                end: 'top 40%',
                scrub: 1,
              },
              scale: 1.15,
              ease: 'power2.out',
            })
          }
        })
      }

      // Button animation
      gsap.from(buttonRef.current, {
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 85%',
          end: 'top 65%',
          scrub: 1,
        },
        scale: 0.8,
        opacity: 0,
        ease: 'back.out(1.7)',
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const projects = [
    {
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D',
      title: 'Devin AI',
      arrow: false,
    },
    {
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      tags: 'CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO',
      title: 'Porsche: Dream Machine',
      arrow: false,
    },
    {
      image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D',
      title: 'Synthetic Human',
      arrow: false,
    },
    {
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D',
      title: 'Meta: Spatial Fusion',
      arrow: true,
    },
    {
      image: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=800',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D • WEB3',
      title: 'Spaace - NFT Marketplace',
      arrow: false,
    },
    {
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
      tags: 'WEB • DESIGN • DEVELOPMENT • 3D',
      title: 'DDD 2024',
      arrow: false,
    },
    {
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
      tags: 'CONCEPT • WEB • GAME DESIGN • 3D',
      title: 'Choo Choo World',
      arrow: false,
    },
    {
      image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800',
      tags: 'AR • DEVELOPMENT • 3D',
      title: 'Soda Experience',
      arrow: false,
    },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#f5f5f5] py-32 px-16"
    >
      {/* Header Section */}
      <div className="flex justify-between items-end mb-20">
        {/* Large Headline */}
        <h2
          ref={headlineRef}
          className="text-[9rem] font-normal leading-[0.9] text-black tracking-normal max-5-5xl"
        >
          Featured Work
        </h2>

        {/* Description Text */}
        
        <p
          ref={descriptionRef}
          className="text-md font-medium leading-relaxed text-black max-w-sm mt-8 tracking-wider"
          style={{ lineHeight: '1.7' }}
        >
          A SELECTION OF OUR MOST PASSIONATELY CRAFTED WORKS WITH FORWARD-THINKING CLIENTS AND FRIENDS OVER THE YEARS.
        </p>
      </div>

      {/* Project Grid */}
      <div ref={cardsRef} className="grid grid-cols-2 gap-8 mb-20">
        {projects.map((project, index) => (
          <div
            key={index}
            className="project-card group cursor-pointer"
          >
            {/* Project Image */}
            <div className="relative overflow-hidden rounded-[2rem] mb-4 bg-gray-200" style={{ aspectRatio: '16/10' }}>
              <img
                src={project.image}
                alt={project.title}
                className="project-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>

            {/* Project Info */}
            <div className='mb-12'>
              <p className="text-md font-medium text-black mb-2 tracking-wider">
                {project.tags}
              </p>
              <div className="relative flex items-center overflow-hidden">
                {/* Arrow - appears on hover, thicker and centered */}
                <span className="absolute left-0 text-6xl font-bold text-black opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out flex items-center">
                  →
                </span>
                {/* Title - slides right on hover */}
                <h3 className="text-6xl font-normal text-black tracking-tight transition-transform duration-500 ease-out group-hover:translate-x-16">
                  {project.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Projects Button */}
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          className="group relative flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-lg font-medium hover:bg-[#0044ff] hover:text-white transition-all duration-300 shadow-lg border border-gray-200 overflow-hidden"
        >
          {/* Dot - hides on hover */}
          <span className="w-3 h-3 bg-black rounded-full group-hover:opacity-0 group-hover:scale-0 transition-all duration-300" />
          
          {/* Text - slides left on hover */}
          <span className="group-hover:-translate-x-8 transition-transform duration-300 tracking-wider">
            SEE ALL PROJECTS
          </span>
          
          {/* Arrow - appears on hover from right */}
          <span className="absolute right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-2xl font-bold">
            →
          </span>
        </button>
      </div>
    </section>
  )
}