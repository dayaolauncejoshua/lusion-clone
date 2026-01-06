import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'

function GalaxyModel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/galaxy.glb')
  const [centered, setCentered] = useState(false)

  useEffect(() => {
    if (scene && !centered) {
      const box = new THREE.Box3().setFromObject(scene)
      const center = box.getCenter(new THREE.Vector3())
      scene.position.x = -center.x
      scene.position.y = -center.y
      scene.position.z = -center.z
      setCentered(true)
    }
  }, [scene, centered])

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation for living feel - stationary movement
      groupRef.current.rotation.y += 0.0008
      groupRef.current.rotation.x += 0.0003
    }

    // Camera zoom
    const targetZ = 1 + scrollProgress * 14
    
    state.camera.position.set(0, 0, targetZ)
    state.camera.lookAt(0, 0, 0)
    state.camera.updateMatrixWorld()
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={25} />
    </group>
  )
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial color="#888888" wireframe />
    </mesh>
  )
}

export default function ParticleHero() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(0) // 0, 1, 2
  const containerRef = useRef<HTMLDivElement>(null)
  const lusionTextRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const section1Ref = useRef<HTMLDivElement>(null) // WE ARE LUSION
  const section2Ref = useRef<HTMLDivElement>(null) // World wide team
  const scrollCountRef = useRef(0)
  const maxScrollSteps = 16 // Reduced from 50 - faster transitions

  useEffect(() => {
    let isScrolling = false

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()

      if (isScrolling) return
      isScrolling = true

      const previousSection = currentSection

      if (e.deltaY > 0) {
        scrollCountRef.current = Math.min(scrollCountRef.current + 1, maxScrollSteps)
      } else {
        scrollCountRef.current = Math.max(scrollCountRef.current - 1, 0)
      }

      // Determine current section (0-15: section 0->1, 16-30: section 1->2)
      let newSection = 0
      if (scrollCountRef.current > 0 && scrollCountRef.current <= 15) {
        newSection = 1
      } else if (scrollCountRef.current > 15) {
        newSection = 2
      }

      // Section transitions
      if (newSection !== previousSection) {
        setCurrentSection(newSection)

        // Transition 0 -> 1
        if (previousSection === 0 && newSection === 1) {
          if (lusionTextRef.current) {
            gsap.to(lusionTextRef.current, {
              opacity: 0,
              duration: 0.4,
            })
          }
          if (scrollIndicatorRef.current) {
            gsap.to(scrollIndicatorRef.current, {
              opacity: 0,
              duration: 0.3,
            })
          }
          if (section1Ref.current) {
            gsap.fromTo(section1Ref.current, 
              { opacity: 0, x: 0 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
            )
          }
        }

        // Transition 1 -> 0
        if (previousSection === 1 && newSection === 0) {
          if (lusionTextRef.current) {
            gsap.to(lusionTextRef.current, {
              opacity: 1,
              duration: 0.5,
            })
          }
          if (scrollIndicatorRef.current) {
            gsap.to(scrollIndicatorRef.current, {
              opacity: 1,
              duration: 0.3,
            })
          }
          if (section1Ref.current) {
            gsap.to(section1Ref.current, {
              opacity: 0,
              duration: 0.3,
            })
          }
        }

        // Transition 1 -> 2
        if (previousSection === 1 && newSection === 2) {
          if (section1Ref.current) {
            gsap.to(section1Ref.current, {
              x: -window.innerWidth,
              opacity: 0,
              duration: 0.7,
              ease: "power2.inOut",
            })
          }
          if (section2Ref.current) {
            gsap.fromTo(section2Ref.current,
              { x: window.innerWidth, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }
            )
          }
        }

        // Transition 2 -> 1
        if (previousSection === 2 && newSection === 1) {
          if (section2Ref.current) {
            gsap.to(section2Ref.current, {
              x: window.innerWidth,
              opacity: 0,
              duration: 0.7,
              ease: "power2.inOut",
            })
          }
          if (section1Ref.current) {
            gsap.fromTo(section1Ref.current,
              { x: -window.innerWidth, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }
            )
          }
        }
      }

      const progress = Math.min(scrollCountRef.current / 15, 1) // Galaxy zoom for first 15 steps
      setScrollProgress(progress)

      setTimeout(() => {
        isScrolling = false
      }, 30)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
    }
  }, [currentSection])

  return (
    <section 
      ref={containerRef}
      className="fixed inset-0 w-full h-screen bg-black overflow-hidden"
    >
      <div className="absolute inset-0">
        <Canvas
          camera={{ 
            position: [0, 0, 1], 
            fov: 75, 
            near: 0.01, 
            far: 1000
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={['#000000']} />
          
          <ambientLight intensity={2.5} />
          <pointLight position={[0, 0, 3]} intensity={12} />
          <pointLight position={[10, 10, 10]} intensity={6} />
          <pointLight position={[-10, -10, -10]} intensity={6} />
          <pointLight position={[0, 10, 5]} intensity={5} />
          
          <Suspense fallback={<LoadingFallback />}>
            <GalaxyModel scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* 5 Plus icons */}
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">+</div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[25%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">+</div>
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">+</div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[25%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">+</div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[5%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">+</div>

      {/* Section 0: Big LUSION Text */}
      <div 
        ref={lusionTextRef}
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none z-20"
      >
        <h1 
          className="text-[8rem] sm:text-[11rem] md:text-[15rem] lg:text-[20rem] xl:text-[25rem] 2xl:text-[30rem] font-medium text-white tracking-tight leading-none"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          LUSION
        </h1>
      </div>

      <div 
        ref={scrollIndicatorRef}
        className="absolute bottom-0 right-4 sm:right-6 md:right-8 lg:right-12 flex justify-end items-center pointer-events-none z-20"
      >
        <div className="text-white text-[24px] sm:text-3xl uppercase tracking-[0.1em] font-normal">
          SCROLL TO EXPLORE
        </div>
      </div>

      {/* Section 1: WE ARE LUSION / NICE TO MEET YOU */}
      <div 
        ref={section1Ref}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <div className="absolute left-8 sm:left-12 md:left-16 lg:left-20 bottom-8 sm:bottom-12 md:bottom-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight tracking-tight"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            WE ARE<br />
            LUSION<br />
            A CREATIVE<br />
            <span className="italic">PRODUCTION STUDIO</span>
          </h2>
        </div>

        <div className="absolute right-8 sm:right-12 md:right-16 lg:right-20 bottom-8 sm:bottom-12 md:bottom-16">
          <h2 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white italic tracking-tight text-right"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            NICE TO<br />
            MEET YOU
          </h2>
        </div>

        <div className="absolute bottom-0 right-4 sm:right-6 md:right-8 lg:right-12 flex justify-end items-center">
          <div className="text-white text-[24px] sm:text-3xl uppercase tracking-[0.1em] font-normal">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>

      {/* Section 2: World Wide Team */}
      <div 
        ref={section2Ref}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        {/* Top left text */}
        <div className="absolute left-8 sm:left-12 md:left-16 lg:left-20 top-24 sm:top-28 md:top-32 lg:top-36">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight tracking-tight"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            A <span className="italic">world wide team</span> of<br />
            experienced and skilled<br />
            professionals
          </h2>
        </div>

        {/* Bottom right text */}
        <div className="absolute right-8 sm:right-12 md:right-16 lg:right-20 bottom-8 sm:bottom-12 md:bottom-16">
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white tracking-tight text-right leading-tight"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            who bring a <span className="italic">wide range</span> of<br />
            talents and perspectives<br />
            to a project.
          </h2>
        </div>

        <div className="absolute bottom-0 right-4 sm:right-6 md:right-8 lg:right-12 flex justify-end items-center">
          <div className="text-white text-[24px] sm:text-3xl uppercase tracking-[0.1em] font-normal">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>
    </section>
  )
}

useGLTF.preload('/models/galaxy.glb')