'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export default function Card({ children, className = '', hover = true, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay }}
      className={`card ${hover ? 'hover:border-[#4A39C0]/20' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
}
