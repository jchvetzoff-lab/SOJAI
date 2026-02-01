'use client';

import { useAnimationStore } from '@/hooks/useAnimationStore';

export default function BackgroundOrbs() {
  const heroOpacity = useAnimationStore((s) => s.heroOpacity);
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);

  // Orbs visible ONLY on title page, disappear when tooth animation starts
  const orbsOpacity = heroOpacity > 0.5 ? 1 : 0;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-500"
      style={{ zIndex: 1, opacity: orbsOpacity }}
    >
      <div
        className="absolute animate-orb"
        style={{
          top: '60%',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(74,57,192,0.55) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute animate-orb"
        style={{
          top: '50%',
          left: '0',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(0,200,200,0.5) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute animate-orb"
        style={{
          bottom: '5%',
          right: '0',
          width: '160px',
          height: '160px',
          background: 'radial-gradient(circle, rgba(255,50,84,0.45) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
