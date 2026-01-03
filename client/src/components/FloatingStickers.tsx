import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface Sticker {
  id: number
  emoji: string
  position: [number, number, number]
  rotation: number
  scale: number
  speed: number
  lane: number
}

const createStickers = (): Sticker[] => {
  const emojis = [
    '🚀', '⚡', '❤️', '😊', '🏀', '🎯', '🌊', '🔥', 
    '🍕', '💜', '🎨', '⭐', '🎮', '🌈', '💎', '🎪',
    '🦄', '🍦', '🎵', '🌟', '🔮', '🎭', '🎨', '🎪',
    '👾', '🌺', '🎨', '💫', '🍭', '🎈', '🌸', '✨',
    '🍓', '🎯', '🌙', '☀️', '🌻', '🦋', '🎀', '🍉'
  ]
  const stickers: Sticker[] = []
  const lanes = 10 // Even more lanes
  
  // Create 80 stickers for wall-to-wall coverage
  for (let i = 0; i < 80; i++) {
    const lane = i % lanes
    const xPosition = -8 + (lane * 1.6) // Extend further: -8 to +8
    
    stickers.push({
      id: i,
      emoji: emojis[i % emojis.length],
      position: [
        xPosition + (Math.random() - 0.5) * 0.9,
        Math.random() * 20 - 10,
        -0.2 - Math.random() * 0.8
      ],
      rotation: (Math.random() - 0.5) * 0.5,
      scale: 0.9 + Math.random() * 0.9,
      speed: 0.32 + Math.random() * 0.58,
      lane
    })
  }
  return stickers
}

const stickers = createStickers()

function FloatingSticker({ sticker }: { sticker: Sticker }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y += sticker.speed * delta
      
      if (meshRef.current.position.y > 10) {
        meshRef.current.position.y = -10
      }
      
      meshRef.current.rotation.z += 0.012 * delta
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={sticker.position}
      rotation={[0, 0, sticker.rotation]}
    >
      <planeGeometry args={[sticker.scale, sticker.scale]} />
      <meshBasicMaterial transparent opacity={0.95}>
        <canvasTexture
          attach="map"
          image={(() => {
            const canvas = document.createElement('canvas')
            canvas.width = 128
            canvas.height = 128
            const ctx = canvas.getContext('2d')!
            ctx.font = 'bold 100px Arial'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(sticker.emoji, 64, 64)
            return canvas
          })()}
        />
      </meshBasicMaterial>
    </mesh>
  )
}

function ShiningDiamonds() {
  const diamondsRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (diamondsRef.current) {
      diamondsRef.current.children.forEach((child, i) => {
        child.position.y += (0.28 + (i % 5) * 0.12) * delta
        
        if (child.position.y > 10) {
          child.position.y = -10
        }
        
        child.rotation.x += 0.02
        child.rotation.y += 0.025
        child.rotation.z += 0.015
      })
    }
  })

  const diamondColors = [
    '#FF1493', '#FF69B4', '#9370DB', '#8A2BE2',
    '#1E90FF', '#00CED1', '#FFD700', '#FFA500',
    '#FF6347', '#7FFF00', '#00FF7F', '#FF00FF'
  ]

  return (
    <group ref={diamondsRef}>
      {/* More diamonds for better coverage */}
      {Array.from({ length: 50 }).map((_, i) => {
        const angle = (i / 50) * Math.PI * 2
        const radius = 2.5 + (i % 5) * 1.6
        const color = diamondColors[i % diamondColors.length]
        
        return (
          <mesh
            key={`diamond-${i}`}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 20,
              -2.5 - Math.random() * 1.5
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
            scale={0.25 + Math.random() * 0.35}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.5}
              metalness={1.0}
              roughness={0.05}
              reflectivity={1.0}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent
              opacity={0.9}
              envMapIntensity={2.0}
            />
          </mesh>
        )
      })}
      
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2 + Math.PI / 4
        const radius = 3 + (i % 4) * 1.4
        const color = diamondColors[(i + 5) % diamondColors.length]
        
        return (
          <mesh
            key={`pyramid-${i}`}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 20,
              -2 - Math.random()
            ]}
            rotation={[
              Math.random() * Math.PI,
              Math.random() * Math.PI,
              Math.random() * Math.PI
            ]}
            scale={0.3 + Math.random() * 0.3}
          >
            <tetrahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              color={color}
              emissive={color}
              emissiveIntensity={1.2}
              metalness={0.95}
              roughness={0.1}
              reflectivity={1.0}
              clearcoat={0.8}
              transparent
              opacity={0.85}
              envMapIntensity={1.8}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function FloatingBubbles() {
  const bubblesRef = useRef<THREE.Group>(null)

  useFrame((_state, delta) => {
    if (bubblesRef.current) {
      bubblesRef.current.children.forEach((child, i) => {
        child.position.y += (0.22 + (i % 4) * 0.09) * delta
        
        if (child.position.y > 10) {
          child.position.y = -10
        }
        
        child.rotation.x += 0.004
        child.rotation.y += 0.006
      })
    }
  })

  return (
    <group ref={bubblesRef}>
      {Array.from({ length: 35 }).map((_, i) => {
        const angle = (i / 35) * Math.PI * 2
        const radius = 3.2 + Math.random() * 2.5
        return (
          <mesh
            key={`bubble-${i}`}
            position={[
              Math.cos(angle) * radius,
              (Math.random() - 0.5) * 20,
              -3 - Math.random() * 0.8
            ]}
            scale={0.18 + Math.random() * 0.25}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshPhysicalMaterial
              color="#ffffff"
              metalness={0}
              roughness={0}
              transmission={0.98}
              thickness={0.8}
              ior={1.5}
              transparent
              opacity={0.4}
              envMapIntensity={2.0}
              clearcoat={1.0}
              clearcoatRoughness={0}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function FloatingStickers() {
  return (
    <>
      <ShiningDiamonds />
      <FloatingBubbles />
      {stickers.map((sticker) => (
        <FloatingSticker key={sticker.id} sticker={sticker} />
      ))}
    </>
  )
}