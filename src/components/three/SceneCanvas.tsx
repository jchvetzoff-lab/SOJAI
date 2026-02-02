'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ToothScene from './ToothScene';
import { useAnimationStore } from '@/hooks/useAnimationStore';

function SceneOpacity() {
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);
  const scrollProgress = useAnimationStore((s) => s.scrollProgress);
  const heroOpacity = useAnimationStore((s) => s.heroOpacity);

  // Tooth is visible when:
  // 1. At the top of page (heroOpacity > 0) OR
  // 2. In the animation zone (scrollProgress < 0.95)
  // This ensures tooth never disappears unexpectedly
  const shouldBeVisible = heroOpacity > 0.1 || scrollProgress < 0.95;
  const actualOpacity = shouldBeVisible ? Math.max(sceneOpacity, 0.01) : 0;

  return (
    <div
      className="canvas-container"
      style={{
        opacity: actualOpacity,
        transition: 'opacity 0.2s ease',
        pointerEvents: actualOpacity > 0.1 ? 'auto' : 'none',
        visibility: shouldBeVisible ? 'visible' : 'hidden',
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
