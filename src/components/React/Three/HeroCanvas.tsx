"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function NeuralNetwork() {
  const ref = useRef<THREE.Points>(null);

  // Generate particles in a sphere
  const particleCount = 3000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    
    // Slow rotation
    ref.current.rotation.y = time * 0.05;
    ref.current.rotation.x = Math.sin(time * 0.03) * 0.15;
    
    // Mouse influence
    const pointer = state.pointer;
    ref.current.rotation.y += pointer.x * 0.1;
    ref.current.rotation.x += pointer.y * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d9ff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

function InnerRing() {
  const ref = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const count = 1000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const r = 1.8 + Math.sin(theta * 8) * 0.15;
      pos[i * 3] = r * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = r * Math.sin(theta);
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    ref.current.rotation.y = -time * 0.1;
    ref.current.rotation.z = Math.sin(time * 0.05) * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

export default function HeroCanvas() {
  // Use a simple div if mounted isn't needed, but in Astro client:load handles hydration
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ 
          antialias: false, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <NeuralNetwork />
          <InnerRing />
        </Suspense>
      </Canvas>
    </div>
  );
}
