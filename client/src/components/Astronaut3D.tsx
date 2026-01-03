import { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'
import TunnelEffect from './TunnelEffect'
import FloatingStickers from './FloatingStickers'

export interface Astronaut3DRef {
  animateForward: (progress: number) => void
}

function AstronautModel({ animationProgress, stage }: { animationProgress: number; stage: number }) {
  const meshRef = useRef<THREE.Group>(null)
  const { camera } = useThree()
  
  const { scene, animations } = useGLTF('/models/astronauta.glb')
  const { actions } = useAnimations(animations, meshRef)

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.castShadow = true
          mesh.receiveShadow = true
          // DO NOT modify materials - keep original texture
        }
      })
    }

    if (actions) {
      const actionNames = Object.keys(actions)
      
      if (stage === 3) {
        Object.values(actions).forEach(action => action?.stop())
        const wavingAnimation = actions[actionNames[3]]
        if (wavingAnimation) {
          wavingAnimation.reset().play()
        }
      } else {
        const preferredAnimation = actions['walk'] || actions[actionNames[1]]
        if (preferredAnimation) {
          preferredAnimation.play()
        }
      }
    }
  }, [scene, actions, stage])

  useEffect(() => {
    if (stage === 3) {
      camera.position.set(0, 0, 8)
      camera.lookAt(0, 0, 0)
    }
  }, [stage, camera])

  useFrame((state) => {
    if (meshRef.current) {
      // Stage 3 - Final waving pose
      if (stage === 3) {
        meshRef.current.position.set(0, -2.9, 1)
        meshRef.current.rotation.set(0, 0, 0)
        meshRef.current.scale.setScalar(1.8)
        
        // Gentle floating
        meshRef.current.position.y = -4.0 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08
        return
      }

      // Base floating animation
      const baseY = animationProgress < 0.1 
        ? -2.0 + Math.sin(state.clock.elapsedTime * 0.4) * 0.15 
        : -2.0
      
      const baseRotY = animationProgress < 0.1
        ? Math.sin(state.clock.elapsedTime * 0.2) * 0.1
        : 0
      
      let targetX = 0
      let targetY = baseY
      
      if (animationProgress < 0.6) {
        const pullProgress = animationProgress / 0.6
        targetX = THREE.MathUtils.lerp(0, 0, pullProgress)
        targetY = THREE.MathUtils.lerp(baseY, 0, pullProgress)
      } else {
        const returnProgress = (animationProgress - 0.6) / 0.4
        targetX = THREE.MathUtils.lerp(0, 0, returnProgress)
        targetY = THREE.MathUtils.lerp(0, baseY, returnProgress)
      }
      
      const forwardZ = animationProgress < 0.6
        ? THREE.MathUtils.lerp(1.3, -60, animationProgress / 0.6)
        : THREE.MathUtils.lerp(-60, 1.3, (animationProgress - 0.6) / 0.4)
      
      const forwardScale = animationProgress < 0.6
        ? THREE.MathUtils.lerp(1.0, 0.2, animationProgress / 0.6)
        : THREE.MathUtils.lerp(0.2, 1.0, (animationProgress - 0.6) / 0.4)
      
      const diveTiltX = animationProgress < 0.6
        ? THREE.MathUtils.lerp(0, -0.5, animationProgress / 0.6)
        : THREE.MathUtils.lerp(-0.5, 0, (animationProgress - 0.6) / 0.4)
      
      const spinY = baseRotY + (animationProgress < 0.6 
        ? animationProgress * Math.PI * 6
        : (0.6 * Math.PI * 6) + ((animationProgress - 0.6) * Math.PI * 3))
      
      const diveTiltZ = animationProgress < 0.6
        ? Math.sin(state.clock.elapsedTime * 4) * 0.4 * animationProgress
        : Math.sin(state.clock.elapsedTime * 4) * 0.4 * (1 - (animationProgress - 0.6) / 0.4)
      
      meshRef.current.position.set(targetX, targetY, forwardZ)
      meshRef.current.rotation.set(diveTiltX, spinY, diveTiltZ)
      meshRef.current.scale.setScalar(forwardScale)
    }
  })

  return (
    <group ref={meshRef} position={[0, -1.5, 1.3]}>
      <primitive object={scene} />
    </group>
  )
}

const Astronaut3D = forwardRef<Astronaut3DRef, { stage: number; tunnelProgress: number; showStickers: boolean }>(
  ({ stage, tunnelProgress, showStickers }, ref) => {
    const [animationProgress, setAnimationProgress] = useState(0)

    useImperativeHandle(ref, () => ({
      animateForward: (progress: number) => {
        setAnimationProgress(progress)
      }
    }))

    return (
      <div className="w-full h-full">
        <Canvas
          shadows
          gl={{ 
            preserveDrawingBuffer: true,
            antialias: true,
          }}
          camera={{ 
            position: [0, 0.3, 4],
            fov: 50 
          }}
          style={{ background: '#000000' }}
        >
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[5, 5, 3]}
            intensity={5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-4, 3, -3]} intensity={4} color="#ffffff" />
          <pointLight position={[3, -2, 3]} intensity={3} color="#ffffff" />
          <spotLight
            position={[0, 4, 3]}
            intensity={4}
            angle={0.4}
            penumbra={0.5}
            color="#ffffff"
            castShadow
          />

          <AstronautModel animationProgress={animationProgress} stage={stage} />
          
          {/* KEEP Environment in ALL stages for proper lighting */}
          <Environment preset="city" />
          
          {stage < 3 && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enabled={stage < 2}
              minDistance={2}
              maxDistance={8}
              maxPolarAngle={Math.PI / 1.5}
              minPolarAngle={Math.PI / 4}
              target={[0, 0.3, 0]}
            />
          )}

          {stage < 2 && <Stars />}
          
          {tunnelProgress > 0 && <TunnelEffect progress={tunnelProgress} />}
          
          {showStickers && <FloatingStickers />}
        </Canvas>
      </div>
    )
  }
)

Astronaut3D.displayName = 'Astronaut3D'

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

export default Astronaut3D