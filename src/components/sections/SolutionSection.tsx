'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const solutions = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: 'AI-Powered Analysis',
    description: 'Neural networks trained on millions of dental images deliver consistent, clinical-grade accuracy.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Instant Results',
    description: 'Get comprehensive analysis in under 60 seconds. Identify pathologies and plan treatments immediately.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Clinical Trust',
    description: 'FDA-cleared technology trusted by 10,000+ practitioners. HIPAA and GDPR compliant.',
  },
];

export default function SolutionSection() {
  return (
    <section id="solution" className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Decorative orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(74,57,192,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '-100px',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Why SOJAI"
          title={<>The Complete <span className="gradient-text">Dental AI</span> Platform</>}
          description="Combine the precision of artificial intelligence with your clinical expertise for faster, more accurate diagnoses."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {solutions.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card text-center"
              style={{
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 20px 40px rgba(74,57,192,0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = ''}
            >
              <div
                className="mx-auto"
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #E4E1FF 0%, #F5F3FF 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: '#4A39C0',
                }}
              >
                {item.icon}
              </div>
              <h3 className="heading-card mb-3 sm:mb-4">{item.title}</h3>
              <p className="text-small max-w-xs mx-auto">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
