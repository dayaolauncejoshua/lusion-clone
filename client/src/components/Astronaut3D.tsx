import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function AstronautModel() {
  const meshRef = useRef<THREE.Group>(null)
  
  // Load model and animations
  const { scene, animations } = useGLTF('/models/astronauta.glb')
  const { actions } = useAnimations(animations, meshRef)

  useEffect(() => {
    // Configure the model
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true
          
          // Log material info for debugging
          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            materials.forEach((mat: THREE.Material, idx: number) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                console.log(`Material ${idx}:`, {
                  name: mat.name,
                  hasMap: !!mat.map,
                  mapSrc: mat.map?.image?.src,
                  hasNormalMap: !!mat.normalMap,
                  hasRoughnessMap: !!mat.roughnessMap,
                  hasMetalnessMap: !!mat.metalnessMap,
                  color: mat.color,
                })
                
                // Force material update
                mat.needsUpdate = true
              }
            })
          }
        }
      })
    }

    // Play animation
    if (actions) {
      const actionNames = Object.keys(actions)
      console.log('Available animations:', actionNames)
      
      const preferredAnimation = actions['walk'] || actions[actionNames[3]]
      if (preferredAnimation) {
        preferredAnimation.play()
        console.log('Playing animation:', preferredAnimation.getClip().name)
      }
    }
  }, [scene, actions])

  // Continuous floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -2.0 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <group ref={meshRef} position={[0, -1.5, 1.3]} scale={1.0} rotation={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  )
}

export default function Astronaut3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        gl={{ 
          preserveDrawingBuffer: true,
          antialias: true,
        }}
        camera={{ position: [0, 0.3, 4], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #000000, #0a1929)' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[5, 5, 3]}
          intensity={4}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-4, 3, -3]} intensity={3} color="#5a9fff" />
        <pointLight position={[3, -2, 3]} intensity={2} color="#ffffff" />
        <spotLight
          position={[0, 4, 3]}
          intensity={3}
          angle={0.4}
          penumbra={0.5}
          color="#ffffff"
          castShadow
        />

        <AstronautModel />
        <Environment preset="city" />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 4}
          target={[0, 0.3, 0]}
        />

        <Stars />
      </Canvas>
    </div>
  )
}

const generateStarPositions = () => {
  const positions = new Float32Array(3000 * 3)
  for (let i = 0; i < 3000 * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100
    positions[i + 1] = (Math.random() - 0.5) * 100
    positions[i + 2] = (Math.random() - 0.5) * 100
  }
  return positions
}

const STAR_POSITIONS = generateStarPositions()

function Stars() {
  const starsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.03
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STAR_POSITIONS, 3]}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.08} 
        color="#ffffff" 
        sizeAttenuation 
        transparent 
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

useGLTF.preload('/models/astronauta.glb')