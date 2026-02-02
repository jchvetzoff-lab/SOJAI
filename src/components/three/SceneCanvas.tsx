'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ToothScene from './ToothScene';
import { useAnimationStore } from '@/hooks/useAnimationStore';

// Check if WebGL is available
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Fallback component when WebGL is not available
function WebGLFallback() {
  return (
    <div
      className="canvas-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '200px',
          height: '280px',
          background: 'linear-gradient(180deg, #FFFEF8 0%, #F5E6D3 100%)',
          borderRadius: '40% 40% 45% 45% / 30% 30% 50% 50%',
          boxShadow: '0 20px 60px rgba(74, 57, 192, 0.3)',
          position: 'relative',
        }}
      >
        {/* Simple CSS tooth shape as fallback */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '30px',
            width: '30px',
            height: '80px',
            background: '#F5E6D3',
            borderRadius: '0 0 50% 50%',
            transform: 'rotate(-10deg)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-50px',
            right: '30px',
            width: '30px',
            height: '70px',
            background: '#F5E6D3',
            borderRadius: '0 0 50% 50%',
            transform: 'rotate(10deg)',
          }}
        />
      </div>
    </div>
  );
}

function SceneOpacity() {
  const scrollProgress = useAnimationStore((s) => s.scrollProgress);
  const [mounted, setMounted] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Ensure component is mounted before showing (fixes SSR issues)
  useEffect(() => {
    setMounted(true);
    setWebglSupported(isWebGLAvailable());
  }, []);

  // Simple logic: fully visible until 90% scroll, then fade out
  let opacity = 1;
  if (scrollProgress > 0.90) {
    // Fade from 1 to 0 between 90% and 100%
    opacity = Math.max(0, 1 - (scrollProgress - 0.90) / 0.10);
  }

  if (!mounted) return null;

  // Show fallback if WebGL is not supported
  if (!webglSupported) {
    return <WebGLFallback />;
  }

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
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
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
