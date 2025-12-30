import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

interface ShapeConfig {
  initialPosition: [number, number, number];
  initialRotation: [number, number, number];
  angularVelocity: [number, number, number];
  radius: number;
  color: string;
  type:
    | "torus"
    | "cylinder"
    | "cross"
    | "octahedron"
    | "icosahedron"
    | "dodecahedron"
    | "complex";
  scale: number;
}

interface InteractiveShapeProps {
  config: ShapeConfig;
  index: number;
  getMousePosition: () => THREE.Vector3;
  getAllPositions: () => THREE.Vector3[];
  getAllRadii: () => number[];
  updatePosition: (index: number, position: THREE.Vector3) => void;
  getCenterPoint: () => THREE.Vector3;
}

function InteractiveShape({
  config,
  index,
  getMousePosition,
  getAllPositions,
  getAllRadii,
  updatePosition,
  getCenterPoint,
}: InteractiveShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const position = useRef(new THREE.Vector3(...config.initialPosition));
  const velocity = useRef(new THREE.Vector3());
  const rotation = useRef(new THREE.Euler(...config.initialRotation));

  useFrame((state, delta) => {
    const target = meshRef.current || groupRef.current;
    if (!target) return;

    const mousePos = getMousePosition();
    const allPositions = getAllPositions();
    const allRadii = getAllRadii();
    const centerPoint = getCenterPoint();

    const toCenter = new THREE.Vector3().subVectors(
      centerPoint,
      position.current
    );
    const distanceToCenter = toCenter.length();
    const centerAttractionStrength = 0.008;
    const centerForce = toCenter
      .normalize()
      .multiplyScalar(centerAttractionStrength * distanceToCenter * 0.1);
    velocity.current.add(centerForce);

    const mouseDistance = position.current.distanceTo(mousePos);
    const repulsionRadius = 3.5;

    if (mouseDistance < repulsionRadius) {
      const repulsionStrength = (1 - mouseDistance / repulsionRadius) * 0.12;
      const direction = new THREE.Vector3()
        .subVectors(position.current, mousePos)
        .normalize()
        .multiplyScalar(repulsionStrength);

      velocity.current.add(direction);
    }

    allPositions.forEach((otherPos, otherIndex) => {
      if (otherIndex === index) return;

      const distance = position.current.distanceTo(otherPos);
      const minDistance = config.radius + allRadii[otherIndex];
      const detectionRadius = minDistance * 1.2;

      if (distance < detectionRadius && distance > 0.01) {
        const overlap = detectionRadius - distance;
        const strength = overlap / detectionRadius;

        const separation = new THREE.Vector3()
          .subVectors(position.current, otherPos)
          .normalize()
          .multiplyScalar(strength * 0.08);

        velocity.current.add(separation);
      }
    });

    const bounds = { x: 6.5, y: 3.5, z: 3.5 };
    const boundaryStrength = 0.015;

    if (Math.abs(position.current.x) > bounds.x) {
      velocity.current.x -= Math.sign(position.current.x) * boundaryStrength;
    }
    if (Math.abs(position.current.y) > bounds.y) {
      velocity.current.y -= Math.sign(position.current.y) * boundaryStrength;
    }
    if (Math.abs(position.current.z) > bounds.z) {
      velocity.current.z -= Math.sign(position.current.z) * boundaryStrength;
    }

    const timeScale = Math.min(delta * 60, 2);
    position.current.add(
      velocity.current.clone().multiplyScalar(timeScale * 0.5)
    );
    velocity.current.multiplyScalar(0.96);

    const time = state.clock.elapsedTime;
    const idleForce = new THREE.Vector3(
      Math.sin(time * 0.3 + index * 0.5) * 0.0008,
      Math.cos(time * 0.2 + index * 0.5) * 0.0008,
      Math.sin(time * 0.25 + index * 0.5) * 0.0008
    );
    velocity.current.add(idleForce);

    rotation.current.x += config.angularVelocity[0] * timeScale * 1.5;
    rotation.current.y += config.angularVelocity[1] * timeScale * 1.5;
    rotation.current.z += config.angularVelocity[2] * timeScale * 1.5;

    target.position.copy(position.current);
    target.rotation.copy(rotation.current);

    updatePosition(index, position.current.clone());
  });

  const renderGeometry = () => {
    const { color, type, scale } = config;

    switch (type) {
      case "cross":
        // 3D Plus/Cross shape - 3 intersecting cylinders (EXTRA FAT)
        return (
          <group ref={groupRef}>
            {/* X-axis cylinder */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry
                args={[0.4 * scale, 0.4 * scale, 2 * scale, 16]}
              />
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.8}
              />
            </mesh>
            {/* Y-axis cylinder */}
            <mesh>
              <cylinderGeometry
                args={[0.4 * scale, 0.4 * scale, 2 * scale, 16]}
              />
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.8}
              />
            </mesh>
            {/* Z-axis cylinder */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry
                args={[0.4 * scale, 0.4 * scale, 2 * scale, 16]}
              />
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.8}
              />
            </mesh>
          </group>
        );
      case "torus":
        return (
          <mesh ref={meshRef}>
            <torusGeometry args={[0.8 * scale, 0.35 * scale, 16, 32]} />
            <meshStandardMaterial
              color={color}
              metalness={0.95}
              roughness={0.05}
              envMapIntensity={2}
            />
          </mesh>
        );
      case "cylinder":
        return (
          <mesh ref={meshRef}>
            <cylinderGeometry
              args={[0.4 * scale, 0.4 * scale, 1.5 * scale, 32]}
            />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={1.8}
            />
          </mesh>
        );
      case "octahedron":
        return (
          <mesh ref={meshRef}>
            <octahedronGeometry args={[0.7 * scale]} />
            <meshStandardMaterial
              color={color}
              metalness={0.95}
              roughness={0.05}
              envMapIntensity={2}
            />
          </mesh>
        );
      case "icosahedron":
        return (
          <mesh ref={meshRef}>
            <icosahedronGeometry args={[0.6 * scale]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.1}
              envMapIntensity={1.8}
            />
          </mesh>
        );
      case "dodecahedron":
        return (
          <mesh ref={meshRef}>
            <dodecahedronGeometry args={[0.7 * scale]} />
            <meshStandardMaterial
              color={color}
              metalness={0.95}
              roughness={0.05}
              envMapIntensity={2}
            />
          </mesh>
        );
      case "complex":
        return (
          <group ref={groupRef}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.8}
              />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <torusGeometry args={[0.5, 0.15, 16, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.8}
              />
            </mesh>
            <mesh position={[0, -0.75, 0]}>
              <torusGeometry args={[0.5, 0.15, 16, 32]} />
              <meshStandardMaterial
                color={color}
                metalness={0.9}
                roughness={0.1}
                envMapIntensity={1.8}
              />
            </mesh>
          </group>
        );
      default:
        return null;
    }
  };

  return <>{renderGeometry()}</>;
}

export default function Scene3D() {
  const { camera } = useThree();
  const mousePosition = useRef(new THREE.Vector3(0, 0, 5));
  const shapePositions = useRef<THREE.Vector3[]>([]);
  const centerPoint = useRef(new THREE.Vector3(0, 0, 0));

  const shapeConfigs = useMemo<ShapeConfig[]>(
    () => [
      // Blue cross shapes (3D plus signs)
      {
        initialPosition: [-4, 1.5, 0],
        initialRotation: [0.5, 0.3, 0],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 1.2,
        color: "#0040ff",
        type: "cross",
        scale: 1.3,
      },
      {
        initialPosition: [3, -1, -1],
        initialRotation: [0.8, 0, 0.5],
        angularVelocity: [0.003, 0.002, 0.001],
        radius: 1.1,
        color: "#0044ff",
        type: "cross",
        scale: 1.2,
      },
      {
        initialPosition: [-3, -1, 2],
        initialRotation: [0.6, 0.4, 0.2],
        angularVelocity: [0.003, 0.002, 0.001],
        radius: 1,
        color: "#0042ff",
        type: "cross",
        scale: 1.1,
      },
      {
        initialPosition: [4.5, 1, -0.5],
        initialRotation: [0.7, 0.2, 0.4],
        angularVelocity: [0.002, 0.004, 0.001],
        radius: 1.15,
        color: "#0045ff",
        type: "cross",
        scale: 1.25,
      },
      {
        initialPosition: [-1, 2.5, 1.5],
        initialRotation: [0.5, 0.6, 0.2],
        angularVelocity: [0.003, 0.003, 0.002],
        radius: 1.05,
        color: "#0041ff",
        type: "cross",
        scale: 1.15,
      },
      {
        initialPosition: [2, -2.5, -0.5],
        initialRotation: [0.3, 0.4, 0.2],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 1,
        color: "#0050ff",
        type: "cross",
        scale: 1.1,
      },
      {
        initialPosition: [-6, 2, 1],
        initialRotation: [0.5, 0.4, 0.3],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 0.95,
        color: "#0043ff",
        type: "cross",
        scale: 1,
      },
      {
        initialPosition: [5.5, -1, 0.5],
        initialRotation: [0.4, 0.6, 0.3],
        angularVelocity: [0.003, 0.003, 0.002],
        radius: 1.1,
        color: "#0048ff",
        type: "cross",
        scale: 1.2,
      },

      // Gray/White cross shapes
      {
        initialPosition: [1.5, 1.5, 1],
        initialRotation: [0.3, 0.5, 0],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 1.2,
        color: "#d8d8d8",
        type: "cross",
        scale: 1.3,
      },
      {
        initialPosition: [-5, 1, -0.5],
        initialRotation: [0.4, 0.6, 0.3],
        angularVelocity: [0.002, 0.003, 0.003],
        radius: 1.1,
        color: "#e8e8e8",
        type: "cross",
        scale: 1.2,
      },
      {
        initialPosition: [2, 2, -1.5],
        initialRotation: [0.7, 0.2, 0.4],
        angularVelocity: [0.003, 0.002, 0.001],
        radius: 1.05,
        color: "#dcdcdc",
        type: "cross",
        scale: 1.15,
      },
      {
        initialPosition: [-4.5, 0, 1.5],
        initialRotation: [0.6, 0.4, 0.1],
        angularVelocity: [0.003, 0.002, 0.003],
        radius: 1,
        color: "#d5d5d5",
        type: "cross",
        scale: 1.1,
      },
      {
        initialPosition: [3.5, 1.5, 1.5],
        initialRotation: [0.3, 0.4, 0.5],
        angularVelocity: [0.003, 0.002, 0.001],
        radius: 1.15,
        color: "#c0c0c0",
        type: "cross",
        scale: 1.25,
      },
      {
        initialPosition: [-2.5, -2.5, 2],
        initialRotation: [0.4, 0.5, 0.3],
        angularVelocity: [0.002, 0.003, 0.002],
        radius: 1.05,
        color: "#e0e0e0",
        type: "cross",
        scale: 1.15,
      },

      // Dark/Black cross shapes
      {
        initialPosition: [-2, 0.5, -2],
        initialRotation: [0.3, 0.4, 0.2],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 1,
        color: "#1a1a1a",
        type: "cross",
        scale: 1.1,
      },
      {
        initialPosition: [4, -1.5, 0.5],
        initialRotation: [0.5, 0.3, 0.4],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 1.1,
        color: "#2a2a2a",
        type: "cross",
        scale: 1.2,
      },
      {
        initialPosition: [-4, -2, -1],
        initialRotation: [0.4, 0.5, 0.3],
        angularVelocity: [0.002, 0.003, 0.003],
        radius: 0.95,
        color: "#222222",
        type: "cross",
        scale: 1,
      },
      {
        initialPosition: [0.5, -1.5, -2],
        initialRotation: [0.3, 0.7, 0.1],
        angularVelocity: [0.003, 0.002, 0.001],
        radius: 1.05,
        color: "#333333",
        type: "cross",
        scale: 1.15,
      },

      // Blue toruses (keep some variety)
      {
        initialPosition: [4, 2.5, -2],
        initialRotation: [0.2, 0.8, 0],
        angularVelocity: [0.002, 0.004, 0.001],
        radius: 1,
        color: "#003dff",
        type: "torus",
        scale: 1,
      },
      {
        initialPosition: [5, 0.5, 1],
        initialRotation: [0.3, 0.7, 0.1],
        angularVelocity: [0.002, 0.003, 0.002],
        radius: 1.2,
        color: "#0046ff",
        type: "torus",
        scale: 1.2,
      },
      {
        initialPosition: [-3.5, 2.5, -1],
        initialRotation: [0.4, 0.5, 0.3],
        angularVelocity: [0.003, 0.002, 0.003],
        radius: 1.1,
        color: "#0038ff",
        type: "torus",
        scale: 1.1,
      },
      {
        initialPosition: [1, -2, 2],
        initialRotation: [0.3, 0.4, 0.5],
        angularVelocity: [0.002, 0.002, 0.003],
        radius: 1.1,
        color: "#003aff",
        type: "torus",
        scale: 1.1,
      },
      {
        initialPosition: [-1, -0.5, -2.5],
        initialRotation: [0.6, 0.3, 0.5],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 1,
        color: "#0039ff",
        type: "torus",
        scale: 1,
      },

      // Gray/White toruses
      {
        initialPosition: [0, 3, 0],
        initialRotation: [0, 0.2, 0.5],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 1,
        color: "#f0f0f0",
        type: "torus",
        scale: 1,
      },
      {
        initialPosition: [5, -2, 0],
        initialRotation: [0.5, 0.3, 0.2],
        angularVelocity: [0.002, 0.003, 0.002],
        radius: 0.95,
        color: "#c8c8c8",
        type: "torus",
        scale: 0.95,
      },
      {
        initialPosition: [2.5, 2.5, 0.5],
        initialRotation: [0.4, 0.5, 0.3],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 0.9,
        color: "#e5e5e5",
        type: "torus",
        scale: 0.9,
      },
      {
        initialPosition: [3, 3, 0],
        initialRotation: [0.5, 0.4, 0.2],
        angularVelocity: [0.003, 0.002, 0.003],
        radius: 0.95,
        color: "#e8e8e8",
        type: "torus",
        scale: 0.95,
      },
      {
        initialPosition: [-4, 0, -2.5],
        initialRotation: [0.3, 0.6, 0.4],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 1,
        color: "#c5c5c5",
        type: "torus",
        scale: 1,
      },

      // Polyhedrons for variety
      {
        initialPosition: [-2, 2, 2],
        initialRotation: [0.5, 0.3, 0.4],
        angularVelocity: [0.002, 0.003, 0.002],
        radius: 0.65,
        color: "#0042ff",
        type: "octahedron",
        scale: 1,
      },
      {
        initialPosition: [5.5, 0, -1],
        initialRotation: [0.4, 0.6, 0.2],
        angularVelocity: [0.003, 0.002, 0.003],
        radius: 0.7,
        color: "#0047ff",
        type: "octahedron",
        scale: 1.05,
      },
      {
        initialPosition: [-5, -1.5, 1.5],
        initialRotation: [0.4, 0.5, 0.2],
        angularVelocity: [0.002, 0.003, 0.002],
        radius: 0.6,
        color: "#b8b8b8",
        type: "icosahedron",
        scale: 0.95,
      },
      {
        initialPosition: [-3, -1.5, 0.5],
        initialRotation: [0.5, 0.3, 0.4],
        angularVelocity: [0.002, 0.003, 0.003],
        radius: 0.6,
        color: "#cccccc",
        type: "dodecahedron",
        scale: 0.95,
      },
      {
        initialPosition: [6, 1.5, -1.5],
        initialRotation: [0.4, 0.6, 0.2],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 0.65,
        color: "#dadada",
        type: "octahedron",
        scale: 0.85,
      },
      {
        initialPosition: [1.5, -3, 0.5],
        initialRotation: [0.6, 0.3, 0.5],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 0.65,
        color: "#003eff",
        type: "icosahedron",
        scale: 0.9,
      },

      // Additional cross shapes to increase density
      {
        initialPosition: [-1.5, -0.5, 0],
        initialRotation: [0.2, 0.5, 0.6],
        angularVelocity: [0.002, 0.003, 0.002],
        radius: 1,
        color: "#0046ff",
        type: "cross",
        scale: 1.1,
      },
      {
        initialPosition: [2.5, 0, -2],
        initialRotation: [0.8, 0.3, 0.2],
        angularVelocity: [0.003, 0.002, 0.003],
        radius: 1.05,
        color: "#d0d0d0",
        type: "cross",
        scale: 1.15,
      },
      {
        initialPosition: [0, -2.5, 1.5],
        initialRotation: [0.4, 0.7, 0.1],
        angularVelocity: [0.002, 0.003, 0.001],
        radius: 1.1,
        color: "#0044ff",
        type: "cross",
        scale: 1.2,
      },
      {
        initialPosition: [-3.5, 0.5, -1.5],
        initialRotation: [0.6, 0.2, 0.5],
        angularVelocity: [0.003, 0.002, 0.002],
        radius: 0.95,
        color: "#e8e8e8",
        type: "cross",
        scale: 1.05,
      },
    ],
    []
  );

  if (shapePositions.current.length === 0) {
    shapePositions.current = shapeConfigs.map(
      (config) => new THREE.Vector3(...config.initialPosition)
    );
  }

  useFrame((state) => {
    const pointer = state.pointer;
    const vec = new THREE.Vector3(pointer.x, pointer.y, 0.5);
    vec.unproject(camera);
    const dir = vec.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    mousePosition.current.lerp(pos, 0.08);
  });

  const getMousePosition = () => mousePosition.current;
  const getAllPositions = () => shapePositions.current;
  const getAllRadii = () => shapeConfigs.map((config) => config.radius);
  const getCenterPoint = () => centerPoint.current;
  const updatePosition = (index: number, position: THREE.Vector3) => {
    shapePositions.current[index] = position;
  };

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} castShadow />
      <directionalLight position={[-10, -10, -5]} intensity={0.8} />
      <pointLight position={[0, 5, 5]} intensity={1.5} />
      <pointLight position={[5, 0, 5]} intensity={1} color="#0044ff" />

      <Environment preset="studio" />

      {shapeConfigs.map((config, index) => (
        <InteractiveShape
          key={index}
          config={config}
          index={index}
          getMousePosition={getMousePosition}
          getAllPositions={getAllPositions}
          getAllRadii={getAllRadii}
          updatePosition={updatePosition}
          getCenterPoint={getCenterPoint}
        />
      ))}
    </>
  );
}
