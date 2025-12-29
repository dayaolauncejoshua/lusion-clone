import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="#4a90e2" />
      </mesh>
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
    </>
  )
}

function App() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      
      <div className="fixed top-10 left-10 z-10">
        <h1 className="text-5xl font-bold">Lusion Clone</h1>
        <p className="text-gray-400 mt-2">WebGL Experience</p>
      </div>
    </div>
  )
}

export default App