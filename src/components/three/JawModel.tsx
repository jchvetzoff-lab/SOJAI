'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createCrownGeometry, createRootGeometry } from '@/lib/tooth-geometry';

interface JawModelProps {
  showTeeth?: boolean;
  showNerves?: boolean;
  showBone?: boolean;
  showSinus?: boolean;
  highlightTooth?: number | null;
}

export default function JawModel({
  showTeeth = true,
  showNerves = true,
  showBone = true,
  showSinus = false,
  highlightTooth = null,
}: JawModelProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Slow rotation
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  const crownGeo = useMemo(() => createCrownGeometry(), []);
  const rootGeo = useMemo(() => createRootGeometry(), []);

  // Generate teeth positions in parabolic arch
  const teeth = useMemo(() => {
    const positions: { pos: [number, number, number]; rot: number; idx: number }[] = [];
    const count = 14;
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * Math.PI; // 0 to PI
      const x = Math.cos(t) * 2.2;
      const z = Math.sin(t) * 1.4 - 0.7;
      const rot = t - Math.PI / 2;
      positions.push({ pos: [x, 0, z], rot, idx: i });
    }
    return positions;
  }, []);

  return (
    <group ref={groupRef}>
      {/* Upper jaw bone */}
      {showBone && (
        <mesh position={[0, 0.5, -0.2]}>
          <torusGeometry args={[2.3, 0.4, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#e8d8c8" transparent opacity={0.3} roughness={0.8} />
        </mesh>
      )}

      {/* Teeth */}
      {showTeeth && teeth.map((t) => (
        <group key={t.idx} position={t.pos} rotation={[0, t.rot, 0]}>
          {/* Crown */}
          <mesh geometry={crownGeo} scale={0.6}>
            <meshPhysicalMaterial
              color={highlightTooth === t.idx ? '#8B5CF6' : '#F5F0E8'}
              roughness={0.2}
              clearcoat={0.8}
              clearcoatRoughness={0.1}
            />
          </mesh>
          {/* Root */}
          <mesh geometry={rootGeo} scale={0.6} position={[0, -0.05, 0]}>
            <meshStandardMaterial color="#E8D8B8" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {/* Nerve canal (IAN) */}
      {showNerves && (
        <mesh position={[0, -0.8, -0.1]}>
          <tubeGeometry args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-2.5, 0, 0),
              new THREE.Vector3(-1.5, -0.2, 0.2),
              new THREE.Vector3(0, -0.3, 0.3),
              new THREE.Vector3(1.5, -0.2, 0.2),
              new THREE.Vector3(2.5, 0, 0),
            ]),
            32, 0.06, 8, false
          ]} />
          <meshStandardMaterial color="#FF6B8A" emissive="#FF3254" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* Sinus */}
      {showSinus && (
        <>
          <mesh position={[-1.2, 1.5, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.15} />
          </mesh>
          <mesh position={[1.2, 1.5, 0]}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="#87CEEB" transparent opacity={0.15} />
          </mesh>
        </>
      )}
    </group>
  );
}
