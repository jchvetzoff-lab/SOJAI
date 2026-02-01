'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  tag?: string;
  title: React.ReactNode;
  description?: string;
  center?: boolean;
}

export default function SectionHeading({
  tag,
  title,
  description,
  center = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '60px' }}
    >
      {tag && (
        <div style={{ marginBottom: '20px' }}>
          <span className="badge badge-purple">
            {tag}
          </span>
        </div>
      )}
      <h2
        className="heading-section font-[family-name:var(--font-playfair)] mx-auto px-2"
        style={{ textAlign: 'center', maxWidth: '800px', marginBottom: '30px' }}
      >
        {title}
      </h2>
      {description && (
        <p
          className="text-body mx-auto px-2"
          style={{ textAlign: 'center', maxWidth: '700px' }}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
