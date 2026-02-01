'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function FadeInSection({ children, className = '', delay = 0 }: FadeInSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1], // Smooth out easing
      }}
    >
      {children}
    </motion.div>
  );
}
