'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ProceduralTooth from './ProceduralTooth';
import { useAnimationStore } from '@/hooks/useAnimationStore';

export default function ToothScene() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(({ camera }) => {
    const { cameraZ } = useAnimationStore.getState();
    camera.position.z = cameraZ;
  });

  return (
    <>
      {/* Optimized lighting for light background */}

      {/* Soft ambient fill - slightly warm */}
      <ambientLight intensity={0.6} color="#FFF8F0" />

      {/* Main key light - bright white from top-front-right */}
      <directionalLight
        position={[5, 8, 6]}
        intensity={1.5}
        color="#FFFFFF"
        castShadow
      />

      {/* Fill light - cooler from left to add dimension */}
      <directionalLight
        position={[-4, 4, 3]}
        intensity={0.8}
        color="#F0F4FF"
      />

      {/* Back rim light - subtle purple accent */}
      <directionalLight
        position={[0, 3, -6]}
        intensity={0.5}
        color="#E4E1FF"
      />

      {/* Top highlight for enamel specular */}
      <pointLight
        position={[0, 6, 4]}
        intensity={1.2}
        color="#FFFFFF"
        distance={15}
        decay={2}
      />

      {/* Subtle bottom fill */}
      <pointLight
        position={[0, -4, 4]}
        intensity={0.3}
        color="#FFF5E6"
        distance={10}
        decay={2}
      />

      {/* Hemisphere for natural gradient */}
      <hemisphereLight
        color="#FFFFFF"
        groundColor="#E4E1FF"
        intensity={0.5}
      />

      {/* Tooth */}
      <ProceduralTooth />
    </>
  );
}
