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

// Animated CSS/SVG tooth fallback when WebGL is not available
function WebGLFallback() {
  const scrollProgress = useAnimationStore((s) => s.scrollProgress);

  // Calculate animation values based on scroll
  const scale = 0.6 + scrollProgress * 0.4;
  const rotation = scrollProgress * 180;
  const translateY = -150 + scrollProgress * 100;

  // Color phases
  let crownColor = '#FFFEF8';
  let rootColor = '#F5E6D3';
  let pulpGlow = 'transparent';

  if (scrollProgress > 0.1 && scrollProgress < 0.35) {
    crownColor = '#B8A5F0'; // Purple tint
  } else if (scrollProgress > 0.35 && scrollProgress < 0.6) {
    pulpGlow = 'rgba(255, 50, 84, 0.6)'; // Pink glow
  } else if (scrollProgress > 0.6 && scrollProgress < 0.85) {
    rootColor = '#7DD8D8'; // Cyan tint
  }

  const opacity = scrollProgress > 0.9 ? Math.max(0, 1 - (scrollProgress - 0.9) / 0.1) : 1;

  return (
    <div
      className="canvas-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: opacity,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotateY(${rotation}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d',
          perspective: '1000px',
        }}
      >
        <svg width="200" height="300" viewBox="0 0 200 300" style={{ filter: 'drop-shadow(0 20px 40px rgba(74, 57, 192, 0.3))' }}>
          {/* Crown */}
          <ellipse cx="100" cy="80" rx="70" ry="60" fill={crownColor} style={{ transition: 'fill 0.5s ease' }} />
          <ellipse cx="100" cy="90" rx="65" ry="50" fill={crownColor} style={{ transition: 'fill 0.5s ease' }} />

          {/* Crown highlights */}
          <ellipse cx="80" cy="60" rx="15" ry="10" fill="rgba(255,255,255,0.6)" />

          {/* Body */}
          <path
            d="M 35 90 Q 30 140 50 180 Q 60 200 60 220 L 60 260 Q 60 280 70 285 Q 80 290 85 270 L 90 200"
            fill={rootColor}
            style={{ transition: 'fill 0.5s ease' }}
          />
          <path
            d="M 165 90 Q 170 140 150 180 Q 140 200 140 220 L 140 250 Q 140 270 130 275 Q 120 280 115 260 L 110 200"
            fill={rootColor}
            style={{ transition: 'fill 0.5s ease' }}
          />

          {/* Center body */}
          <ellipse cx="100" cy="130" rx="50" ry="40" fill={crownColor} style={{ transition: 'fill 0.5s ease' }} />

          {/* Pulp chamber (inner glow) */}
          <ellipse
            cx="100"
            cy="120"
            rx="20"
            ry="25"
            fill={pulpGlow}
            style={{ transition: 'fill 0.5s ease' }}
          />

          {/* Subtle details */}
          <path d="M 70 70 Q 100 85 130 70" stroke="rgba(0,0,0,0.05)" strokeWidth="2" fill="none" />
        </svg>
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
