'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAnimationStore } from '@/hooks/useAnimationStore';
import { DIAGNOSTIC_BADGES } from '@/lib/constants';

function Badge({
  label,
  color,
  position,
  index,
}: {
  label: string;
  color: string;
  position: [number, number, number];
  index: number;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    const { badgesVisible, badgeProgress } = useAnimationStore.getState();

    if (ref.current) {
      const delay = index * 0.15;
      const adjustedProgress = Math.max(0, Math.min(1, (badgeProgress - delay) / (1 - delay)));
      const opacity = badgesVisible ? adjustedProgress : 0;
      const scale = badgesVisible ? 0.5 + adjustedProgress * 0.5 : 0;

      ref.current.scale.setScalar(scale);
      ref.current.visible = opacity > 0.01;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Html
        center
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <div
          className="px-3 py-1.5 rounded-full text-white text-xs font-medium whitespace-nowrap border backdrop-blur-sm"
          style={{
            backgroundColor: `${color}CC`,
            borderColor: `${color}66`,
            boxShadow: `0 0 20px ${color}40`,
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

export default function DiagnosticBadges() {
  return (
    <group>
      {DIAGNOSTIC_BADGES.map((badge, i) => (
        <Badge
          key={badge.label}
          label={badge.label}
          color={badge.color}
          position={badge.position}
          index={i}
        />
      ))}
    </group>
  );
}
