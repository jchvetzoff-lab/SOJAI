'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ToothScene from './ToothScene';
import { useAnimationStore } from '@/hooks/useAnimationStore';

function SceneOpacity() {
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);
  const scrollProgress = useAnimationStore((s) => s.scrollProgress);

  // Keep canvas always rendered but control visibility with opacity
  // This prevents issues when scrolling back up
  const isInAnimationZone = scrollProgress < 1;
  const actualOpacity = isInAnimationZone ? sceneOpacity : 0;

  return (
    <div
      className="canvas-container"
      style={{
        opacity: actualOpacity,
        transition: 'opacity 0.15s ease',
        pointerEvents: actualOpacity > 0.1 ? 'auto' : 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ToothScene />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function SceneCanvas() {
  return <SceneOpacity />;
}
