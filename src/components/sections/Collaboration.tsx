'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const features = [
  { title: 'Real-time Sharing', desc: 'Share cases with a single link. No downloads required.' },
  { title: 'Annotation Tools', desc: 'Mark areas of interest with precision drawing tools.' },
  { title: 'Discussion Threads', desc: 'Threaded conversations attached to specific findings.' },
  { title: 'Referral Workflow', desc: 'Seamless referral process with full case history.' },
];

export default function Collaboration() {
  const featureColors = ['#4A39C0', '#8B5CF6', '#FF3254', '#00C8C8'];

  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Collaboration"
          title={<>Share Cases <span className="gradient-text">Seamlessly</span></>}
          description="Collaborate with colleagues in real-time. Share annotated scans and discuss treatment plans within the platform."
        />

        <div className="max-w-4xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              height: '400px',
              marginBottom: '60px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #E4E1FF 0%, #F5F3FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A39C0',
              fontWeight: 500,
              boxShadow: '0 20px 40px rgba(74,57,192,0.1)',
            }}
          >
            Collaboration Interface
          </motion.div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-start">
            {features.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ x: 5, transition: { duration: 0.2 } }}
                style={{
                  padding: '24px',
                  background: 'white',
                  borderRadius: '16px',
                  borderLeft: `4px solid ${featureColors[i]}`,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: `${featureColors[i]}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: featureColors[i] }} />
                  </div>
                  <h4 className="font-semibold text-[#1A1A2E] text-base sm:text-lg">{item.title}</h4>
                </div>
                <p className="text-small" style={{ paddingLeft: '52px' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
