import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function LiquidDistortion() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (cleanupRef.current) {
      cleanupRef.current();
    }

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };
    const trail: Array<{ 
      x: number; 
      y: number; 
      vx: number; 
      vy: number; 
      life: number;
      colorIndex: number;
    }> = [];
    const maxTrailPoints = 20;

    // Beautiful color palette - iridescent pastels
    const colorPalette = [
      [0.7, 0.85, 1.0],   // Soft blue
      [1.0, 0.75, 0.9],   // Soft pink
      [0.85, 1.0, 0.85],  // Soft mint
      [1.0, 0.9, 0.7],    // Soft peach
      [0.9, 0.8, 1.0],    // Soft lavender
      [0.75, 1.0, 0.95],  // Soft cyan
      [1.0, 0.85, 0.75],  // Soft coral
      [0.8, 0.95, 1.0]    // Soft sky
    ];

    let colorCounter = 0;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTrailCount: { value: 0 },
        uTrailPositions: { value: new Float32Array(maxTrailPoints * 2) },
        uTrailColors: { value: new Float32Array(maxTrailPoints * 3) },
        uTrailLife: { value: new Float32Array(maxTrailPoints) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uResolution;
        uniform int uTrailCount;
        uniform float uTrailPositions[40];
        uniform float uTrailColors[60];
        uniform float uTrailLife[20];
        
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          vec3 color = vec3(0.0);
          float totalInfluence = 0.0;
          
          for(int i = 0; i < 20; i++) {
            if(i >= uTrailCount) break;
            
            vec2 trailPos = vec2(uTrailPositions[i * 2], uTrailPositions[i * 2 + 1]) / uResolution;
            float dist = length(uv - trailPos);
            float life = uTrailLife[i];
            
            float radius = 0.12 + life * 0.06;
            float influence = smoothstep(radius, 0.0, dist) * life;
            
            vec3 trailColor = vec3(
              uTrailColors[i * 3],
              uTrailColors[i * 3 + 1],
              uTrailColors[i * 3 + 2]
            );
            
            // Add shimmer effect
            float shimmer = sin(uTime * 2.0 + float(i) * 0.5) * 0.5 + 0.5;
            trailColor = mix(trailColor, vec3(1.0), shimmer * 0.15);
            
            // Soft glow
            trailColor = pow(trailColor, vec3(0.8));
            
            color += trailColor * influence;
            totalInfluence += influence;
          }
          
          // Brighter, more visible alpha
          float alpha = smoothstep(0.0, 0.6, totalInfluence) * 0.5;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      depthWrite: false
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX;
      mouse.y = window.innerHeight - e.clientY;

      const vx = mouse.x - mouse.prevX;
      const vy = mouse.y - mouse.prevY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > 1) {
        // Cycle through beautiful colors
        const selectedColor = colorPalette[colorCounter % colorPalette.length];
        colorCounter++;
        
        trail.push({
          x: mouse.x,
          y: mouse.y,
          vx,
          vy,
          life: 1.0,
          colorIndex: colorCounter - 1
        });

        if (trail.length > maxTrailPoints) {
          trail.shift();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].life *= 0.94;
        if (trail[i].life < 0.01) {
          trail.splice(i, 1);
        }
      }

      material.uniforms.uTime.value += 0.02;
      material.uniforms.uTrailCount.value = trail.length;

      for (let i = 0; i < trail.length; i++) {
        const color = colorPalette[trail[i].colorIndex % colorPalette.length];
        material.uniforms.uTrailPositions.value[i * 2] = trail[i].x;
        material.uniforms.uTrailPositions.value[i * 2 + 1] = trail[i].y;
        material.uniforms.uTrailColors.value[i * 3] = color[0];
        material.uniforms.uTrailColors.value[i * 3 + 1] = color[1];
        material.uniforms.uTrailColors.value[i * 3 + 2] = color[2];
        material.uniforms.uTrailLife.value[i] = trail[i].life;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      material.uniforms.uResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    cleanupRef.current = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      scene.clear();
    };

    return cleanupRef.current;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
}