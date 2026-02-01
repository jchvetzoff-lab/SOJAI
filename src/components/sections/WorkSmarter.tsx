'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const steps = [
  {
    step: '01',
    title: 'Upload Scan',
    description: 'Drag & drop your CBCT, panoramic, or periapical images. Supports DICOM and standard formats.',
  },
  {
    step: '02',
    title: 'AI Analysis',
    description: 'Our AI processes the scan in under 60 seconds, identifying pathologies and mapping anatomy.',
  },
  {
    step: '03',
    title: 'Review & Report',
    description: 'Review AI findings with interactive overlays and generate professional PDF reports.',
  },
];

export default function WorkSmarter() {
  const stepColors = ['#4A39C0', '#8B5CF6', '#FF3254'];

  return (
    <section className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Connecting line decoration */}
      <div style={{
        position: 'absolute',
        top: '280px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #E4E1FF 20%, #E4E1FF 80%, transparent)',
        pointerEvents: 'none',
        display: 'none',
      }} className="lg:block" />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Workflow"
          title={<>Work <span className="gradient-text">Smarter</span>, Not Harder</>}
          description="An intuitive interface designed by dentists, for dentists. Three simple steps."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 max-w-5xl mx-auto justify-items-center" style={{ marginBottom: '80px' }}>
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
              style={{ position: 'relative' }}
            >
              <div
                style={{
                  fontSize: '70px',
                  fontWeight: 'bold',
                  fontFamily: 'var(--font-playfair)',
                  marginBottom: '24px',
                  background: `linear-gradient(135deg, ${stepColors[i]}40 0%, ${stepColors[i]}20 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {item.step}
              </div>
              <h3 className="heading-card mb-3 sm:mb-4" style={{ color: stepColors[i] }}>{item.title}</h3>
              <p className="text-small max-w-xs mx-auto">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(74,57,192,0.15)',
            border: '1px solid rgba(0,0,0,0.05)',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            background: 'linear-gradient(135deg, #F9F8FF 0%, #F5F3FF 100%)',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF5F57' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FFBD2E' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28CA41' }} />
            <span style={{ marginLeft: '16px', fontSize: '14px', color: 'rgba(26,26,46,0.4)' }}>SOJAI Dashboard</span>
          </div>
          <div
            style={{
              height: '350px',
              background: 'linear-gradient(180deg, #F5F3FF 0%, #E4E1FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A39C0',
              fontWeight: 500,
            }}
          >
            Dashboard Interface Preview
          </div>
        </motion.div>
      </div>
    </section>
  );
}
