'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const audiences = [
  {
    title: 'Practitioners',
    subtitle: 'Solo & Group Practices',
    subtitleColor: '#4A39C0',
    dotColor: '#4A39C0',
    bgColor: '#F9F8FF',
    description: 'Enhance your diagnostic workflow with AI-assisted analysis.',
    features: ['Instant CBCT analysis', 'Pathology detection', 'Treatment suggestions'],
  },
  {
    title: 'Clinics',
    subtitle: 'Multi-Location Clinics',
    subtitleColor: '#FF3254',
    dotColor: '#FF3254',
    bgColor: '#FFF0F2',
    description: 'Standardize diagnostics across all your locations.',
    features: ['Centralized dashboard', 'Team management', 'Quality metrics'],
  },
  {
    title: 'Laboratories',
    subtitle: 'Dental Labs & Research',
    subtitleColor: '#8B5CF6',
    dotColor: '#8B5CF6',
    bgColor: '#F5F3FF',
    description: 'Accelerate research with AI automation.',
    features: ['Batch processing', 'API integration', 'Research tools'],
  },
];

export default function AudienceCards() {
  return (
    <section className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)' }}>
      {/* Decorative dots pattern */}
      <div style={{
        position: 'absolute',
        top: '20%',
        right: '5%',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 8px)',
        gap: '12px',
        opacity: 0.3,
        pointerEvents: 'none',
      }}>
        {[...Array(15)].map((_, i) => (
          <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4A39C0' }} />
        ))}
      </div>

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Who It's For"
          title={<>Built for <span style={{ color: '#4A39C0' }}>Every</span> Dental Professional</>}
          description="Whether you're a solo practitioner or managing a network of clinics, SOJAI scales with your needs."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {audiences.map((audience, i) => (
            <motion.div
              key={audience.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card text-center"
              style={{
                cursor: 'pointer',
                borderTop: `3px solid ${audience.dotColor}`,
              }}
            >
              <div
                className="icon-box mx-auto"
                style={{ background: audience.bgColor }}
              >
                <div
                  className="icon-dot"
                  style={{
                    background: audience.dotColor,
                    boxShadow: `0 0 20px ${audience.dotColor}40`,
                  }}
                />
              </div>

              <h3 className="heading-card mb-1 sm:mb-2">{audience.title}</h3>

              <p
                className="text-sm sm:text-base font-medium mb-3 sm:mb-4"
                style={{ color: audience.subtitleColor }}
              >
                {audience.subtitle}
              </p>

              <p className="text-small mb-4 sm:mb-6">{audience.description}</p>

              <ul className="check-list inline-block text-left">
                {audience.features.map((feature) => (
                  <li key={feature} style={{ color: audience.dotColor }}>
                    <svg className="check-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: audience.dotColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span style={{ color: 'rgba(26,26,46,0.6)' }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
