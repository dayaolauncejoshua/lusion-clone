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
    name: "Marco Ludovico Perego",
    role: "CREATIVE DEVELOPER",
    modelPath: "/models/faces/person3.glb",
    description:
      "Marco combines technical expertise with creative innovation to build immersive digital experiences that push the boundaries of what's possible on the web.",
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

// 3D Face Model Component with Lusion.co style
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
        // Subtle wave effect
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

          // Dense particle sampling for smoother look
          for (let i = 0; i < positionAttribute.count; i += 2) {
            const x = (positionAttribute.getX(i) - center.x) * scale;
            const y = (positionAttribute.getY(i) - center.y) * scale;
            const z = (positionAttribute.getZ(i) - center.z) * scale;

            positions.push(x, y, z);

            // Varying sizes for depth
            const sizeVariation = 0.8 + Math.random() * 0.4;
            sizes.push(sizeVariation);

            // Color variation for rim lighting effect
            let brightness = 0.5;
            if (normalAttribute) {
              const nx = normalAttribute.getX(i);
              const ny = normalAttribute.getY(i);
              const nz = normalAttribute.getZ(i);

              // Rim lighting: brighter on edges
              const viewVector = new THREE.Vector3(0, 0, 1);
              const normalVector = new THREE.Vector3(nx, ny, nz).normalize();
              const dot = Math.abs(viewVector.dot(normalVector));
              brightness = 1 - dot; // Inverse for rim effect
            }

            // Blue gradient
            colors.push(
              0.2 + brightness * 0.3, // R
              0.6 + brightness * 0.4, // G
              1.0 // B
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

  // Custom shader material for better particle rendering
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
          gl_FragColor = vec4(vColor, 1.0) * texColor;
          gl_FragColor.a *= 0.9;
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

// Blue Cursor Follower - fixed version
function BlueCursor({
  mousePosition,
}: {
  mousePosition: { x: number; y: number } | null;
}) {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !mousePosition) return;

    gsap.to(cursorRef.current, {
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
      duration: 0.15,
      ease: "power2.out",
    });
  }, [mousePosition]);

  if (!mousePosition) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 w-20 h-20"
      style={{ left: 0, top: 0 }}
    >
      <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
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

// Matrix Rain Component
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

    const chars =
      "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    function draw() {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
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

// Team Section Component with Navigation - FIXED
function TeamSection({ isVisible }: { isVisible: boolean }) {
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isLeftSide, setIsLeftSide] = useState(false);
  const [globalMousePosition, setGlobalMousePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const faceContainerRef = useRef<HTMLDivElement>(null);
  const memberInfoRef = useRef<HTMLDivElement>(null);

  const currentMember = teamMembers[currentMemberIndex];

  useEffect(() => {
    if (!isVisible) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      setGlobalMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [isVisible]);

  const handleNext = () => {
    const nextIndex = (currentMemberIndex + 1) % teamMembers.length;
    animateTransition(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex =
      (currentMemberIndex - 1 + teamMembers.length) % teamMembers.length;
    animateTransition(prevIndex);
  };

  const animateTransition = (newIndex: number) => {
    if (memberInfoRef.current) {
      gsap.to(memberInfoRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          setCurrentMemberIndex(newIndex);
          gsap.fromTo(
            memberInfoRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3 }
          );
        },
      });
    } else {
      setCurrentMemberIndex(newIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!faceContainerRef.current) return;

    const rect = faceContainerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const mouseX = e.clientX;

    setIsLeftSide(mouseX < centerX);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setMousePosition(null);
  };

  const handleClick = () => {
    if (isLeftSide) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Blue cursor follower */}
      <BlueCursor mousePosition={globalMousePosition} />

      {/* Matrix rain effect */}
      <MatrixRain />

      {/* TEAM text - top right */}
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

      {/* 3D Face Model - NO BLACK BACKGROUND */}
      <div
        ref={faceContainerRef}
        className="absolute top-1/2 left-[20%] -translate-y-1/2 w-[500px] h-[600px] cursor-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <Canvas
          camera={{ position: [0, 0, 4], fov: 50 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
          style={{ background: "transparent" }}
        >
          {/* Enhanced lighting for lusion.co style */}
          <ambientLight intensity={0.4} />

          {/* Key light - blue tinted */}
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.5}
            color="#5599ff"
          />

          {/* Fill light - cyan */}
          <pointLight position={[-3, 2, 4]} intensity={1.2} color="#44bbff" />

          {/* Rim light - bright blue for edges */}
          <pointLight position={[-5, 0, -3]} intensity={2} color="#66ccff" />

          {/* Back light for depth */}
          <pointLight position={[0, -3, -5]} intensity={1.5} color="#3388ff" />

          {/* Top light - white for highlights */}
          <spotLight
            position={[0, 8, 3]}
            intensity={2.5}
            angle={0.6}
            penumbra={0.8}
            color="#ffffff"
            castShadow={false}
          />

          {/* Bottom fill - subtle blue */}
          <pointLight position={[0, -5, 2]} intensity={1} color="#2266cc" />

          <Suspense fallback={null}>
            <FaceModel
              key={currentMember.modelPath}
              modelPath={currentMember.modelPath}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Person info - bottom left */}
      <div
        ref={memberInfoRef}
        className="absolute left-8 sm:left-12 md:left-16 lg:left-20 bottom-24 sm:bottom-28 pointer-events-none z-20"
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
          className="text-3xl sm:text-4xl md:text-5xl font-medium text-white mb-2"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {currentMember.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-400 uppercase tracking-widest">
          {currentMember.role}
        </p>
      </div>

      {/* Description - bottom right */}
      <div className="absolute right-8 sm:right-12 md:right-16 lg:right-20 bottom-16 sm:bottom-20 max-w-lg pointer-events-none z-20">
        <p
          className="text-sm sm:text-base md:text-lg text-white leading-relaxed"
          style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
        >
          {currentMember.description}
        </p>
      </div>

      <div className="absolute bottom-0 right-4 sm:right-6 md:right-8 lg:right-12 flex justify-end items-center pointer-events-none z-20">
        <div className="text-white text-[24px] sm:text-3xl uppercase tracking-[0.1em] font-normal">
          SCROLL TO EXPLORE
        </div>
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
  const maxScrollSteps = 45;

  useEffect(() => {
    let isScrolling = false;

    const handleWheel = (e: WheelEvent) => {
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
      container.addEventListener("wheel", handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [currentSection]);

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
      <div className="absolute top-1/2 -translate-y-1/2 left-[5%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-[25%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[25%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">
        +
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-[5%] text-white text-2xl sm:text-3xl font-light pointer-events-none z-20">
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
