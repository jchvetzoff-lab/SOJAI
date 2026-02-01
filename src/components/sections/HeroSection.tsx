'use client';

import { useAnimationStore } from '@/hooks/useAnimationStore';

export default function HeroSection() {
  const heroOpacity = useAnimationStore((s) => s.heroOpacity);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Text content - fixed like Diagnocat */}
      <div
        className="fixed top-0 left-0 right-0 flex flex-col items-center text-center px-4 sm:px-6 z-30"
        style={{ opacity: heroOpacity, transform: `translateY(${(1 - heroOpacity) * -20}px)`, paddingTop: '120px' }}
      >
        {/* Main heading - BIG like Diagnocat */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-[#1A1A2E] mb-6 sm:mb-8 max-w-4xl mx-auto">
          All-in-one <span className="gradient-text">AI Solution</span>
          <br />
          for Dental Diagnostics
        </h1>

        {/* Description - simple like Diagnocat */}
        <p className="text-base sm:text-lg md:text-xl text-[#1A1A2E]/60 max-w-2xl mx-auto leading-relaxed">
          SOJAI is an award-winning solution that analyzes dental images,
          streamlining workflows and enhancing patient care.
        </p>
      </div>

      {/* 3D Tooth area - takes remaining space */}
      <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px]">
        {/* The actual 3D tooth renders in the fixed SceneCanvas component */}
      </div>
    </section>
  );
}
