'use client';

import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AnimationSpacer() {
  // Activate the GSAP scroll animation
  useScrollAnimation();

  return (
    <div
      id="animation-spacer"
      className="relative h-[400vh] sm:h-[550vh] md:h-[700vh]"
      aria-hidden="true"
    />
  );
}
