'use client';

import { useRef } from 'react';
import * as THREE from 'three';

interface ImplantModelProps {
  position?: [number, number, number];
  safetyStatus?: 'safe' | 'warning' | 'danger';
}

export default function ImplantModel({ position = [0, 0, 0], safetyStatus = 'safe' }: ImplantModelProps) {
  const safetyColor = safetyStatus === 'safe' ? '#10B981' : safetyStatus === 'warning' ? '#F59E0B' : '#EF4444';

  return (
    <group position={position}>
      {/* Implant screw body */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.12, 0.08, 1.2, 16]} />
        <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Thread lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, -0.15 - i * 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.01, 4, 16]} />
          <meshStandardMaterial color="#A0A0A0" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      {/* Abutment */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 16]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Crown */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.18, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#F5F0E8" roughness={0.2} clearcoat={0.8} />
      </mesh>

      {/* Safety zone sphere */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={safetyColor} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* Safety zone wireframe */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color={safetyColor} wireframe transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
