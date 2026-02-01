'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAnimationStore } from './useAnimationStore';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimation() {
  const updateFromScroll = useAnimationStore((s) => s.updateFromScroll);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#animation-spacer',
      start: 'top top',
      end: 'bottom bottom',
      scrub: true, // Immediate response - follows scroll exactly
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        updateFromScroll(self.progress);
      },
    });

    // Refresh to ensure proper tracking
    ScrollTrigger.refresh();

    return () => {
      trigger.kill();
    };
  }, [updateFromScroll]);
}
