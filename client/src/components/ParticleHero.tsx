import { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";

// Team member data
const teamMembers = [
  {
    name: "Andrii Ovsiannikov",
    role: "ART DIRECTOR",
    modelPath: "/models/faces/person1.glb",
    description:
      "As a result of our diverse experience, we are able to think creatively and find new solutions to problems, providing clients with memorable, purpose-driven experiences that cut through the noise and connect where it matters.",
  },
  {
    name: "Paul Catoera",
    role: "3D MOTION DESIGNER",
    modelPath: "/models/faces/person2.glb",
    description:
      "With years of experience in 3D motion design, Paul brings creative vision to life through stunning visual narratives that captivate audiences and elevate brand storytelling.",
  },
  {
    name: "Mia Ludovico Perego",
    role: "CREATIVE DEVELOPER",
    modelPath: "/models/faces/person3.glb",
    description:
      "Mia combines technical expertise with creative innovation to build immersive digital experiences that push the boundaries of what's possible on the web.",
  },
];

function GalaxyModel({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/galaxy.glb");
  const [centered, setCentered] = useState(false);

  useEffect(() => {
    if (scene && !centered) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.x = -center.x;
      scene.position.y = -center.y;
      scene.position.z = -center.z;
      setCentered(true);
    }
  }, [scene, centered]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0008;
      groupRef.current.rotation.x += 0.0003;
    }

    const targetZ = 1 + scrollProgress * 14;

    state.camera.position.set(0, 0, targetZ);
    state.camera.lookAt(0, 0, 0);
    state.camera.updateMatrixWorld();
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={scene} scale={25} />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial color="#888888" wireframe />
    </mesh>
  );
}

// 3D Face Model Component with Grayish-Blue Duotone
function FaceModel({ modelPath }: { modelPath: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelPath);
  const [isReady, setIsReady] = useState(false);
  const particlesRef = useRef<THREE.Points>(null);

  useEffect(() => {
    if (!scene || isReady) return;

    const clonedScene = scene.clone();
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    clonedScene.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetScale = 3.5 / maxDim;
    clonedScene.scale.setScalar(targetScale);

    if (groupRef.current) {
      while (groupRef.current.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }
      groupRef.current.add(clonedScene);
    }

    setIsReady(true);
  }, [scene, isReady]);

  useFrame((state) => {
    if (groupRef.current && isReady) {
      const targetRotationY =
        -0.3 + Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
      const targetRotationX = Math.sin(state.clock.elapsedTime * 0.15) * 0.02;

      groupRef.current.rotation.y = targetRotationY;
      groupRef.current.rotation.x = targetRotationX;
    }

    // Animate particles
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      const time = state.clock.elapsedTime;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += Math.sin(time * 2 + positions[i] * 5) * 0.001;
      }

      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particlesGeometry = useMemo(() => {
    if (!scene) return null;

    const positions: number[] = [];
    const sizes: number[] = [];
    const colors: number[] = [];

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        const geometry = child.geometry;
        const positionAttribute = geometry.attributes.position;
        const normalAttribute = geometry.attributes.normal;

        if (positionAttribute) {
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 3.5 / maxDim;

          for (let i = 0; i < positionAttribute.count; i += 2) {
            const x = (positionAttribute.getX(i) - center.x) * scale;
            const y = (positionAttribute.getY(i) - center.y) * scale;
            const z = (positionAttribute.getZ(i) - center.z) * scale;

            positions.push(x, y, z);

            // Varying sizes for depth
            const sizeVariation = 0.8 + Math.random() * 0.4;
            sizes.push(sizeVariation);

            // Calculate lighting and depth for color variation
            let brightness = 0.5;
            let rimEffect = 0;

            if (normalAttribute) {
              const nx = normalAttribute.getX(i);
              const ny = normalAttribute.getY(i);
              const nz = normalAttribute.getZ(i);

              // Rim lighting calculation
              const viewVector = new THREE.Vector3(0, 0, 1);
              const normalVector = new THREE.Vector3(nx, ny, nz).normalize();
              const dot = Math.abs(viewVector.dot(normalVector));

              rimEffect = 1 - dot; // Stronger on edges
              brightness = 0.3 + dot * 0.7; // Darker on edges, lighter on front
            }

            // Depth-based variation (y position affects tone)
            const depthFactor = (y + 2) / 4; // Normalize y position

            // Grayish-blue duotone with skin tone preservation
            // Base gray-blue color
            const baseGray = 0.45 + brightness * 0.25;
            const baseBlue = 0.55 + brightness * 0.35;

            // Add blue glow on rims
            const rimBlue = rimEffect * 0.4;

            // Subtle warm tone to preserve skin feel
            const skinWarmth = depthFactor * 0.1;

            colors.push(
              baseGray + skinWarmth + rimBlue * 0.3, // R - gray with slight warmth
              baseGray + rimBlue * 0.5, // G - gray with blue tint
              baseBlue + rimBlue // B - blue dominant
            );
          }
        }
      }
    });

    if (positions.length === 0) return null;

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    return particleGeometry;
  }, [scene]);

  const particleMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: {
          value: new THREE.TextureLoader().load(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAWdEVYdENyZWF0aW9uIFRpbWUAMDMvMTQvMTI/UgKxAAAA+ElEQVRYhe2WwQ6DIAxAYfz/X3YXPG4e9jDZxJjMZFqxhT56kJhIX0tbChBCAMdxnAZwlZRSSiml9DsA4LoRYwyMMcA5/zqeMcZXxswczjkghHzl03VdME0TDMMw7pwQ8pFXLgCGYUhEUErpu0ZRBHEcQ5qmkGUZZFkGaZpCHMcQRRF9J6WEpmnoul3XIAxDOsMLAMZxpIMopYAx5jhL0xR837+MMc/znlqn6zqq1xGAT0KapiGO4/8LKIpC9To0wPf94DkLw/AVQFEUFNdaU4ezzoM6z3OSc9lEURT0XT6ft4BSyvn/i6Zp3u67A+h/8HEc/h8tz6V19V9b10YAAAAASUVORK5CYII="
          ),
        },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * 15.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        varying vec3 vColor;
        
        void main() {
          vec4 texColor = texture2D(pointTexture, gl_PointCoord);
          
          // Grayish-blue tint with soft glow
          vec3 finalColor = vColor * 1.2; // Slight boost
          
          gl_FragColor = vec4(finalColor, 1.0) * texColor;
          gl_FragColor.a *= 0.85;
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true,
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {particlesGeometry && (
        <points
          ref={particlesRef}
          geometry={particlesGeometry}
          material={particleMaterial}
        />
      )}
    </group>
  );
}

// Blue Cursor Follower with directional arrows
// Blue Cursor Follower with directional arrows - NO BLINKING
function BlueCursor({
  mousePosition,
  isInTeamSection,
  isLeftSide,
  onPrevious,
  onNext,
}: {
  mousePosition: { x: number; y: number } | null;
  isInTeamSection: boolean;
  isLeftSide: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!cursorRef.current || !mousePosition) return;

    // Set initial position immediately without animation
    if (!isInitializedRef.current) {
      gsap.set(cursorRef.current, {
        x: mousePosition.x - 40,
        y: mousePosition.y - 40,
      });
      isInitializedRef.current = true;
    } else {
      // Animate subsequent movements
      gsap.to(cursorRef.current, {
        x: mousePosition.x - 40,
        y: mousePosition.y - 40,
        duration: 0.15,
        ease: "power2.out",
      });
    }
  }, [mousePosition]);

  // Always render but hide when not needed
  if (!mousePosition) return null;

  const handleClick = () => {
    if (!isInTeamSection) return;
    
    if (isLeftSide) {
      onPrevious();
    } else {
      onNext();
    }
  };

  return (
    <div
      ref={cursorRef}
      onClick={handleClick}
      className="fixed z-50 w-20 h-20 transition-opacity duration-200"
      style={{ 
        left: 0, 
        top: 0,
        opacity: isInTeamSection ? 1 : 0,
        pointerEvents: isInTeamSection ? 'auto' : 'none',
        cursor: isInTeamSection ? 'pointer' : 'default'
      }}
    >
      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50 transition-transform hover:scale-110">
        {isLeftSide ? (
          // Left arrow for previous
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        ) : (
          // Right arrow for next
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        )}
      </div>
    </div>
  );
}

// // Navigation arrows component
// function NavigationArrows({
//   isLeft,
//   onClick
// }: {
//   isLeft: boolean
//   onClick: () => void
// }) {
//   return (
//     <div
//       onClick={onClick}
//       className="absolute top-1/2 -translate-y-1/2 z-30 cursor-pointer"
//       style={{
//         left: isLeft ? '50%' : 'auto',
//         right: isLeft ? 'auto' : '50%',
//         transform: isLeft ? 'translate(-50%, -50%)' : 'translate(50%, -50%)',
//       }}
//     >
//       <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-blue-500">
//         <svg
//           width="32"
//           height="32"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="white"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           style={{ transform: isLeft ? 'rotate(0deg)' : 'rotate(180deg)' }}
//         >
//           <line x1="19" y1="12" x2="5" y2="12"></line>
//           <polyline points="12 19 5 12 12 5"></polyline>
//         </svg>
//       </div>
//     </div>
//   )
// }

// Matrix Rain Component - Cyan/Blue color like lusion.co
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyan/blue color like lusion.co
      ctx.fillStyle = "#00d9ff";
      ctx.font = "14px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

// Animated Matrix Code Component
function AnimatedMatrixCode() {
  const [code, setCode] = useState("");

  useEffect(() => {
    const chars = "0123456789ABCDEFGHIJKLMNOP";
    const interval = setInterval(() => {
      let newCode = "";
      for (let i = 0; i < 8; i++) {
        newCode += chars[Math.floor(Math.random() * chars.length)];
      }
      setCode(newCode);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-md text-white opacity-70">{code}</span>
  );
}

// Team Section Component - Fixed auto-loop carousel
function TeamSection({ isVisible }: { isVisible: boolean }) {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [isLeftSide, setIsLeftSide] = useState(false);
  const [globalMousePosition, setGlobalMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const faceContainerRef = useRef<HTMLDivElement>(null);
  const memberInfoRef = useRef<HTMLDivElement>(null);
  const autoLoopTimerRef = useRef<number | null>(null);
  const currentIndexRef = useRef(currentMemberIndex); // Keep track of current index

  const currentMember = teamMembers[currentMemberIndex];

  // Update ref when index changes
  useEffect(() => {
    currentIndexRef.current = currentMemberIndex;
  }, [currentMemberIndex]);

  // Track mouse globally and determine left/right side
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setGlobalMousePosition({ x: e.clientX, y: e.clientY });
      
      // Determine left/right based on screen center
      const screenCenter = window.innerWidth / 2;
      setIsLeftSide(e.clientX < screenCenter);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // Auto-loop functionality - 5 second interval - FIXED
  useEffect(() => {
    if (!isVisible) return;

    // Clear existing timer
    if (autoLoopTimerRef.current) {
      clearInterval(autoLoopTimerRef.current);
    }

    // Start new timer - use ref to get current index
    autoLoopTimerRef.current = setInterval(() => {
      if (isTransitioning) return;
      
      const nextIndex = (currentIndexRef.current + 1) % teamMembers.length;
      animateTransition(nextIndex, 'next');
    }, 5000); // 5 seconds

    return () => {
      if (autoLoopTimerRef.current) {
        clearInterval(autoLoopTimerRef.current);
      }
    };
  }, [isVisible]); // Only depend on isVisible, not currentMemberIndex

  const handleNext = () => {
    if (isTransitioning) return;
    
    // Clear and restart auto-loop timer
    if (autoLoopTimerRef.current) {
      clearInterval(autoLoopTimerRef.current);
    }

    const nextIndex = (currentMemberIndex + 1) % teamMembers.length;
    animateTransition(nextIndex, 'next');

    // Restart auto-loop
    autoLoopTimerRef.current = setInterval(() => {
      if (isTransitioning) return;
      const next = (currentIndexRef.current + 1) % teamMembers.length;
      animateTransition(next, 'next');
    }, 5000);
  };

  const handlePrevious = () => {
    if (isTransitioning) return;
    
    // Clear and restart auto-loop timer
    if (autoLoopTimerRef.current) {
      clearInterval(autoLoopTimerRef.current);
    }

    const prevIndex =
      (currentMemberIndex - 1 + teamMembers.length) % teamMembers.length;
    animateTransition(prevIndex, 'previous');

    // Restart auto-loop
    autoLoopTimerRef.current = setInterval(() => {
      if (isTransitioning) return;
      const next = (currentIndexRef.current + 1) % teamMembers.length;
      animateTransition(next, 'next');
    }, 5000);
  };

  const animateTransition = (newIndex: number, direction: 'next' | 'previous') => {
    setIsTransitioning(true);

    // Smooth, chill slide distances
    const exitX = direction === 'next' ? -600 : 600;
    const enterFromX = direction === 'next' ? 600 : -600;

    // Create timeline for coordinated smooth animations
    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false);
      }
    });

    // Smoothly animate face container out
    if (faceContainerRef.current) {
      tl.to(faceContainerRef.current, {
        x: exitX,
        opacity: 0,
        duration: 1.2,
        ease: "power1.inOut",
      }, 0);
    }

    // Smoothly animate member info out
    if (memberInfoRef.current) {
      tl.to(memberInfoRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power1.in",
      }, 0);
    }

    // Change the member index at midpoint
    tl.call(() => {
      setCurrentMemberIndex(newIndex);
    }, [], 0.5);

    // Smoothly animate face container in
    if (faceContainerRef.current) {
      tl.fromTo(faceContainerRef.current,
        {
          x: enterFromX,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power1.inOut",
        }, 0.6);
    }

    // Smoothly animate member info in
    if (memberInfoRef.current) {
      tl.fromTo(memberInfoRef.current,
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power1.out",
        }, 0.8);
    }
  };

  if (!isVisible) return null;

  const memberNumber = String(currentMemberIndex + 1).padStart(2, "0");

  return (
    <>
      {/* Rest of the component stays the same... */}
      <BlueCursor
        mousePosition={globalMousePosition}
        isInTeamSection={isVisible}
        isLeftSide={isLeftSide}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <div
        className="absolute inset-0 cursor-none z-5"
        onClick={() => {
          if (isLeftSide) {
            handlePrevious();
          } else {
            handleNext();
          }
        }}
      />

      <MatrixRain />

      <div className="absolute top-24 sm:top-28 md:top-32 left-8 sm:left-12 md:left-16 lg:left-20 pointer-events-none z-20">
        <div className="flex items-center gap-80 font-mono text-md md:text-base text-white">
          <div className="flex items-center">
            <span className="text-white opacity-70">[[</span>
            <span className="mx-2 text-white font-bold">{memberNumber}</span>
            <span className="text-white opacity-70">]]</span>
          </div>

          <div className="flex gap-3">
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
            <span className="text-white opacity-50">|</span>
          </div>

          <AnimatedMatrixCode />
        </div>
      </div>

      <div className="absolute top-24 sm:top-28 md:top-32 right-8 sm:right-12 md:right-16 lg:right-20 pointer-events-none z-20">
        <h2
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-medium text-white tracking-wider"
          style={{
            fontFamily: "Helvetica, Arial, sans-serif",
            letterSpacing: "0.2em",
          }}
        >
          TEAM
        </h2>
      </div>

      <div
        ref={faceContainerRef}
        className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[500px] h-[600px] pointer-events-none z-10"
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.3} color="#667788" />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.8}
            color="#88aacc"
          />
          <pointLight position={[-3, 2, 4]} intensity={1.3} color="#6699bb" />
          <pointLight position={[-5, 0, -3]} intensity={2.2} color="#99ccee" />
          <pointLight position={[0, -3, -5]} intensity={1.4} color="#5577aa" />
          <spotLight
            position={[0, 8, 3]}
            intensity={2}
            angle={0.6}
            penumbra={0.8}
            color="#aabbcc"
            castShadow={false}
          />
          <pointLight position={[0, -5, 2]} intensity={0.9} color="#445566" />

          <Suspense fallback={null}>
            <FaceModel
              key={currentMember.modelPath}
              modelPath={currentMember.modelPath}
            />
          </Suspense>
        </Canvas>
      </div>

      <div
        ref={memberInfoRef}
        className="absolute left-8 sm:left-12 md:left-16 lg:left-20 bottom-16 sm:bottom-20 pointer-events-none z-20"
      >
        <div className="flex items-center gap-3 mb-3">
          {teamMembers.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMemberIndex
                  ? "bg-white scale-125"
                  : "bg-gray-600"
              }`}
            />
          ))}
        </div>
        <h3
          className="text-2xl sm:text-3xl md:text-4xl font-medium text-white mb-2"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {currentMember.name}
        </h3>
        <p className="text-xs font-normal xs:text-base text-gray-400 uppercase tracking-widest">
          {currentMember.role}
        </p>
      </div>

      <div className="absolute right-8 sm:right-10 md:right-14 lg:right-18 bottom-12 sm:bottom-16 max-w-md pointer-events-none z-20">
        <p
          className="text-sm sm:text-base md:text-lg text-white leading-relaxed"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {currentMember.description}
        </p>
      </div>
    </>
  );
}

export default function ParticleHero() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lusionTextRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section3Ref = useRef<HTMLDivElement>(null);
  const scrollCountRef = useRef(0);
  const maxScrollSteps = 35;

  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
      // If we're at section 3 (Team) and scrolling down, allow normal scroll
      if (currentSection === 3 && e.deltaY > 0 && scrollCountRef.current >= maxScrollSteps) {
        // Don't prevent default - allow page to scroll
        return;
      }

      // If we're not in the component area, allow normal scroll
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      // If container is not in view, allow normal scroll
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        return;
      }

      e.preventDefault();

      if (isScrolling) return;
      isScrolling = true;

      const previousSection = currentSection;

      if (e.deltaY > 0) {
        scrollCountRef.current = Math.min(
          scrollCountRef.current + 1,
          maxScrollSteps
        );
      } else {
        scrollCountRef.current = Math.max(scrollCountRef.current - 1, 0);
      }

      let newSection = 0;
      if (scrollCountRef.current > 0 && scrollCountRef.current <= 15) {
        newSection = 1;
      } else if (scrollCountRef.current > 15 && scrollCountRef.current <= 30) {
        newSection = 2;
      } else if (scrollCountRef.current > 30) {
        newSection = 3;
      }

      if (newSection !== previousSection) {
        setCurrentSection(newSection);

        // Transition 0 -> 1
        if (previousSection === 0 && newSection === 1) {
          if (lusionTextRef.current) {
            gsap.to(lusionTextRef.current, { opacity: 0, duration: 0.4 });
          }
          if (scrollIndicatorRef.current) {
            gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.3 });
          }
          if (section1Ref.current) {
            gsap.fromTo(
              section1Ref.current,
              { opacity: 0, x: 0 },
              { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
            );
          }
        }

        // Transition 1 -> 0
        if (previousSection === 1 && newSection === 0) {
          if (lusionTextRef.current) {
            gsap.to(lusionTextRef.current, { opacity: 1, duration: 0.5 });
          }
          if (scrollIndicatorRef.current) {
            gsap.to(scrollIndicatorRef.current, { opacity: 1, duration: 0.3 });
          }
          if (section1Ref.current) {
            gsap.to(section1Ref.current, { opacity: 0, duration: 0.3 });
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
            });
          }
          if (section2Ref.current) {
            gsap.fromTo(
              section2Ref.current,
              { x: window.innerWidth, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }
            );
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
            });
          }
          if (section1Ref.current) {
            gsap.fromTo(
              section1Ref.current,
              { x: -window.innerWidth, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }
            );
          }
        }

        // Transition 2 -> 3
        if (previousSection === 2 && newSection === 3) {
          if (section2Ref.current) {
            gsap.to(section2Ref.current, {
              x: -window.innerWidth,
              opacity: 0,
              duration: 0.7,
              ease: "power2.inOut",
            });
          }
          if (section3Ref.current) {
            gsap.fromTo(
              section3Ref.current,
              { opacity: 0 },
              { opacity: 1, duration: 0.8, ease: "power2.out" }
            );
          }
        }

        // Transition 3 -> 2
        if (previousSection === 3 && newSection === 2) {
          if (section3Ref.current) {
            gsap.to(section3Ref.current, {
              opacity: 0,
              duration: 0.5,
            });
          }
          if (section2Ref.current) {
            gsap.fromTo(
              section2Ref.current,
              { x: -window.innerWidth, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.7, ease: "power2.inOut" }
            );
          }
        }
      }

      const progress = Math.min(scrollCountRef.current / 15, 1);
      setScrollProgress(progress);

      setTimeout(() => {
        isScrolling = false;
      }, 30);
    };

    const container = containerRef.current;
    if (container) {
      // Listen on window for better scroll detection
      window.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentSection]);

  return (
     <section
    ref={containerRef}
    className="h-screen w-full bg-black overflow-hidden relative"
    style={{ height: '100vh' }}
  >
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 0, 1],
            fov: 75,
            near: 0.01,
            far: 1000,
          }}
          dpr={[1, 2]}
        >
          <color attach="background" args={["#000000"]} />

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
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] text-gray-400 text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[25%] text-gray-400 text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-gray-400 text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[25%] text-gray-400 text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[5%] text-gray-400 text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>

      {/* Section 0: Big LUSION */}
      <div
        ref={lusionTextRef}
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none z-20"
      >
        <h1
          className="text-[8rem] sm:text-[11rem] md:text-[15rem] lg:text-[20rem] xl:text-[25rem] 2xl:text-[30rem] font-medium text-white tracking-tight leading-none"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
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

      {/* Section 1: WE ARE LUSION */}
      <div
        ref={section1Ref}
        className="absolute inset-0 pointer-events-none z-10"
        style={{ opacity: 0 }}
      >
        <div className="absolute left-8 sm:left-12 md:left-16 lg:left-20 bottom-8 sm:bottom-12 md:bottom-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight tracking-tight"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            WE ARE
            <br />
            LUSION
            <br />
            A CREATIVE
            <br />
            <span className="italic">PRODUCTION STUDIO</span>
          </h2>
        </div>

        <div className="absolute right-8 sm:right-12 md:right-16 lg:right-20 bottom-8 sm:bottom-12 md:bottom-16">
          <h2
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium text-white italic tracking-tight text-right"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            NICE TO
            <br />
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
        <div className="absolute left-8 sm:left-12 md:left-16 lg:left-20 top-24 sm:top-28 md:top-32 lg:top-36">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white leading-tight tracking-tight"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            A <span className="italic">world wide team</span> of
            <br />
            experienced and skilled
            <br />
            professionals
          </h2>
        </div>

        <div className="absolute right-8 sm:right-12 md:right-16 lg:right-20 bottom-8 sm:bottom-12 md:bottom-16">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-white tracking-tight text-right leading-tight"
            style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
          >
            who bring a <span className="italic">wide range</span> of
            <br />
            talents and perspectives
            <br />
            to a project.
          </h2>
        </div>

        <div className="absolute bottom-0 right-4 sm:right-6 md:right-8 lg:right-12 flex justify-end items-center">
          <div className="text-white text-[24px] sm:text-3xl uppercase tracking-[0.1em] font-normal">
            SCROLL TO EXPLORE
          </div>
        </div>
      </div>

      {/* Section 3: Team Member Profile */}
      <div
        ref={section3Ref}
        className="absolute inset-0 z-10"
        style={{ opacity: 0 }}
      >
        <TeamSection isVisible={currentSection === 3} />
      </div>
    </section>
  );
}

useGLTF.preload("/models/galaxy.glb");
teamMembers.forEach((member) => {
  useGLTF.preload(member.modelPath);
});