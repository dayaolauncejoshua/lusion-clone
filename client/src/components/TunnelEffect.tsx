import { useRef, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const createEnergyParticles = () => {
  const count = 8000
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 25 // Much wider spread
    const depth = Math.random() * 150
    
    positions[i * 3] = Math.cos(angle) * radius
    positions[i * 3 + 1] = Math.sin(angle) * radius
    positions[i * 3 + 2] = -depth
    
    const color = new THREE.Color().setHSL(Math.random(), 0.9, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }
  
  return { positions, colors, count }
}

export default function TunnelEffect({ progress }: { progress: number }) {
  const portalRingsRef = useRef<THREE.Group>(null)
  const energyParticlesRef = useRef<THREE.Points>(null)
  const distortionMeshRef = useRef<THREE.Mesh>(null)
  const outerRingsRef = useRef<THREE.Group>(null)
  
  // Large portal rings that fill the screen
  const rings = useMemo(() => {
    const ringGeometries: THREE.Mesh[] = []
    for (let i = 0; i < 50; i++) {
      const radius = 5 + i * 1.2
      const geometry = new THREE.TorusGeometry(radius, 0.15, 16, 64)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL((i * 0.02) % 1, 0.8, 0.5),
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = -i * 3 - 20
      ringGeometries.push(mesh)
    }
    return ringGeometries
  }, [])

  // Outer atmospheric rings
  const outerRings = useMemo(() => {
    const ringGeometries: THREE.Mesh[] = []
    for (let i = 0; i < 30; i++) {
      const radius = 20 + i * 2
      const geometry = new THREE.TorusGeometry(radius, 0.3, 16, 64)
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL((i * 0.03) % 1, 0.7, 0.4),
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = -i * 4 - 30
      ringGeometries.push(mesh)
    }
    return ringGeometries
  }, [])

  const energyParticles = useMemo(() => createEnergyParticles(), [])

  useEffect(() => {
    if (portalRingsRef.current) {
      rings.forEach(ring => {
        portalRingsRef.current!.add(ring)
      })
    }
    if (outerRingsRef.current) {
      outerRings.forEach(ring => {
        outerRingsRef.current!.add(ring)
      })
    }
  }, [rings, outerRings])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    
    const stage1 = Math.min(1, Math.max(0, (progress - 0.0) * 3))
    const stage2 = Math.min(1, Math.max(0, (progress - 0.33) * 3))
    const stage3 = Math.min(1, Math.max(0, (progress - 0.66) * 3))
    
    // Animate main portal rings
    if (portalRingsRef.current) {
      rings.forEach((ring, i) => {
        ring.position.z += (15 + i * 0.8) * delta * progress
        
        if (ring.position.z > 15) {
          ring.position.z = -150
        }
        
        ring.rotation.z = time * 0.8 + i * 0.15
        
        const scale = 1.5 + (ring.position.z + 150) / 100
        ring.scale.set(scale, scale, 1)
        
        const hue = stage1 > 0.5 ? 0.55 : stage2 > 0.5 ? 0.85 : stage3 > 0.5 ? 0.15 : 0.55
        ;(ring.material as THREE.MeshBasicMaterial).color.setHSL((hue + i * 0.02) % 1, 0.8, 0.5)
        
        const opacity = (0.3 + Math.sin(time * 2 + i * 0.3) * 0.2) * progress
        ;(ring.material as THREE.MeshBasicMaterial).opacity = opacity
      })
    }

    // Animate outer rings
    if (outerRingsRef.current) {
      outerRings.forEach((ring, i) => {
        ring.position.z += (20 + i * 1) * delta * progress
        
        if (ring.position.z > 20) {
          ring.position.z = -180
        }
        
        ring.rotation.z = -time * 0.5 - i * 0.1
        
        const scale = 1.8 + (ring.position.z + 180) / 120
        ring.scale.set(scale, scale, 1)
        
        const hue = stage1 > 0.5 ? 0.5 : stage2 > 0.5 ? 0.8 : stage3 > 0.5 ? 0.1 : 0.5
        ;(ring.material as THREE.MeshBasicMaterial).color.setHSL((hue + i * 0.03) % 1, 0.7, 0.4)
        
        const opacity = (0.15 + Math.sin(time * 1.5 - i * 0.2) * 0.1) * progress
        ;(ring.material as THREE.MeshBasicMaterial).opacity = opacity
      })
    }
    
    // Animate swirling energy particles
    if (energyParticlesRef.current) {
      const positions = energyParticlesRef.current.geometry.attributes.position.array as Float32Array
      const colors = energyParticlesRef.current.geometry.attributes.color.array as Float32Array
      
      for (let i = 0; i < energyParticles.count; i++) {
        const idx = i * 3
        
        const x = positions[idx]
        const y = positions[idx + 1]
        let z = positions[idx + 2]
        
        const angle = Math.atan2(y, x)
        const radius = Math.sqrt(x * x + y * y)
        const newAngle = angle + delta * 1.5 * progress
        
        positions[idx] = Math.cos(newAngle) * radius
        positions[idx + 1] = Math.sin(newAngle) * radius
        
        z += (40 + radius * 0.5) * delta * progress
        
        if (z > 15) {
          z = -150
          const resetAngle = Math.random() * Math.PI * 2
          const resetRadius = Math.random() * 25
          positions[idx] = Math.cos(resetAngle) * resetRadius
          positions[idx + 1] = Math.sin(resetAngle) * resetRadius
        }
        
        positions[idx + 2] = z
        
        const hue = stage1 > 0.5 ? 0.5 + Math.random() * 0.15 : 
                    stage2 > 0.5 ? 0.8 + Math.random() * 0.15 : 
                    0.15 + Math.random() * 0.15
        const color = new THREE.Color().setHSL(hue, 0.9, 0.7)
        colors[idx] = color.r
        colors[idx + 1] = color.g
        colors[idx + 2] = color.b
      }
      
      energyParticlesRef.current.geometry.attributes.position.needsUpdate = true
      energyParticlesRef.current.geometry.attributes.color.needsUpdate = true
    }
    
    // Animate distortion mesh
    if (distortionMeshRef.current) {
      distortionMeshRef.current.rotation.z = time * 0.4
      const material = distortionMeshRef.current.material as THREE.ShaderMaterial
      material.uniforms.uTime.value = time
      material.uniforms.uProgress.value = progress
      material.uniforms.uStage1.value = stage1
      material.uniforms.uStage2.value = stage2
      material.uniforms.uStage3.value = stage3
    }
  })

  return (
    <group>
      {/* Main portal rings */}
      <group ref={portalRingsRef} />
      
      {/* Outer atmospheric rings */}
      <group ref={outerRingsRef} />
      
      {/* Energy particles */}
      <points ref={energyParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[energyParticles.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[energyParticles.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          vertexColors
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      {/* Large distortion cylinder - fills screen */}
      <mesh ref={distortionMeshRef} position={[0, 0, -50]}>
        <cylinderGeometry args={[40, 40, 200, 64, 1, true]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uProgress: { value: 0 },
            uStage1: { value: 0 },
            uStage2: { value: 0 },
            uStage3: { value: 0 }
          }}
          vertexShader={`
            varying vec2 vUv;
            
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform float uProgress;
            uniform float uStage1;
            uniform float uStage2;
            uniform float uStage3;
            
            varying vec2 vUv;
            
            void main() {
              // Multiple wave layers
              float wave1 = sin(vUv.y * 30.0 - uTime * 4.0) * 0.5 + 0.5;
              float wave2 = sin(vUv.y * 15.0 + uTime * 2.0) * 0.5 + 0.5;
              
              // Spiral streaks
              float spiral = sin(vUv.x * 60.0 + vUv.y * 10.0 + uTime * 3.0) * 0.5 + 0.5;
              
              float pattern = (wave1 * 0.5 + wave2 * 0.3 + spiral * 0.2);
              
              // Color based on stage
              vec3 color;
              if (uStage1 > 0.5) {
                color = vec3(0.2, 0.5, 1.0);
              } else if (uStage2 > 0.5) {
                color = vec3(0.9, 0.2, 0.9);
              } else if (uStage3 > 0.5) {
                color = vec3(0.2, 1.0, 0.6);
              } else {
                color = vec3(0.4, 0.7, 1.0);
              }
              
              // Radial gradient
              float radial = 1.0 - abs(vUv.x - 0.5) * 2.0;
              radial = pow(radial, 0.5);
              
              float alpha = pattern * radial * uProgress * 0.2;
              
              gl_FragColor = vec4(color, alpha);
            }
          `}
        />
      </mesh>
    </group>
  )
}