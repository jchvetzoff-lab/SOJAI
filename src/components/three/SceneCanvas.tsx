'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ToothScene from './ToothScene';
import { useAnimationStore } from '@/hooks/useAnimationStore';

function SceneOpacity() {
  const scrollProgress = useAnimationStore((s) => s.scrollProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fully visible until 90% scroll, then fade out
  let opacity = 1;
  if (scrollProgress > 0.90) {
    opacity = Math.max(0, 1 - (scrollProgress - 0.90) / 0.10);
  }

  if (!mounted) return null;

  return (
    <div
      className="canvas-container"
      style={{
        opacity: opacity,
        transition: 'opacity 0.3s ease',
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false }}
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
