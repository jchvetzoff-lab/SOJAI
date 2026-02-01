'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const features = [
  {
    title: 'CBCT Analysis',
    description: 'Full 3D analysis of cone beam CT scans with automatic pathology detection.',
    badge: 'AI-Powered',
    badgeColor: 'purple',
  },
  {
    title: '2D X-Ray Analysis',
    description: 'Instant analysis of panoramic, periapical, and bitewing radiographs.',
    badge: 'Fast',
    badgeColor: 'pink',
  },
  {
    title: 'AI Reports',
    description: 'Generate professional PDF reports with findings and recommendations.',
    badge: 'Automated',
    badgeColor: 'purple',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="section-padding" style={{ background: '#FFFFFF', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative gradient orb */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(74,57,192,0.05) 0%, transparent 60%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Features"
          title={<>Everything You <span style={{ position: 'relative', display: 'inline-block' }}>Need<svg style={{ position: 'absolute', bottom: '-5px', left: 0, width: '100%', height: '8px' }} viewBox="0 0 100 8" preserveAspectRatio="none"><path d="M0 7 Q50 0 100 7" stroke="#4A39C0" strokeWidth="3" fill="none" strokeLinecap="round"/></svg></span></>}
          description="A comprehensive suite of AI-powered tools designed to elevate your dental practice."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card text-center"
              style={{ cursor: 'pointer', background: 'white' }}
            >
              <div
                className="img-placeholder"
                style={{
                  height: '180px',
                  marginBottom: '20px',
                  borderRadius: '16px',
                  background: feature.badgeColor === 'pink'
                    ? 'linear-gradient(135deg, #FFF0F2 0%, #FFE4E8 100%)'
                    : 'linear-gradient(135deg, #F5F3FF 0%, #E4E1FF 100%)',
                }}
              >
                {feature.title} Preview
              </div>

              <div style={{ marginBottom: '15px' }}>
                <span
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: feature.badgeColor === 'pink' ? '#FFE4E8' : '#E4E1FF',
                    color: feature.badgeColor === 'pink' ? '#FF3254' : '#4A39C0',
                  }}
                >
                  {feature.badge}
                </span>
              </div>

              <h3 className="heading-card mb-2 sm:mb-3">{feature.title}</h3>
              <p className="text-small">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
