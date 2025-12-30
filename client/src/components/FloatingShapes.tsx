import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TorusKnot } from '@react-three/drei'
import * as THREE from 'three'

interface ShapeProps {
  position: [number, number, number]
  geometry: React.ReactNode
  color: string
  speed?: number
}

function FloatingShape({ position, geometry, color, speed = 1 }: ShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x += 0.001 * speed
    meshRef.current.rotation.y += 0.002 * speed
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 * speed) * 0.3
  })

  return (
    <mesh ref={meshRef} position={position} castShadow>
      {geometry}
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.1}
        envMapIntensity={1}
      />
    </mesh>
  )
}

export default function FloatingShapes() {
  return (
    <>
      {/* Blue shapes */}
      <FloatingShape
        position={[-3, 2, -2]}
        geometry={<TorusKnot args={[0.6, 0.2, 128, 32]} />}
        color="#3b82f6"
        speed={0.8}
      />
      <FloatingShape
        position={[3, -1, -3]}
        geometry={<torusGeometry args={[0.7, 0.3, 32, 64]} />}
        color="#2563eb"
        speed={1.2}
      />
      <FloatingShape
        position={[2, 2, -4]}
        geometry={<boxGeometry args={[1, 1, 1]} />}
        color="#1d4ed8"
        speed={1}
      />

      {/* Gray/White shapes */}
      <FloatingShape
        position={[-2, -2, -2]}
        geometry={<cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />}
        color="#e5e7eb"
        speed={0.9}
      />
      <FloatingShape
        position={[1, 0, -1]}
        geometry={<torusGeometry args={[0.5, 0.2, 32, 64]} />}
        color="#d1d5db"
        speed={1.1}
      />
      <FloatingShape
        position={[-1, 1, -3]}
        geometry={<octahedronGeometry args={[0.8]} />}
        color="#f3f4f6"
        speed={0.7}
      />
    </>
  )
}