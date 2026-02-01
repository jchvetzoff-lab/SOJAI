'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const detections = [
  { label: 'Caries Detection', accuracy: 99.2 },
  { label: 'Periapical Lesions', accuracy: 98.7 },
  { label: 'Bone Loss Analysis', accuracy: 97.9 },
  { label: 'Root Fractures', accuracy: 96.5 },
  { label: 'Impacted Teeth', accuracy: 99.5 },
  { label: 'Sinus Pathology', accuracy: 95.8 },
];

export default function AIDetection() {
  return (
    <section id="detection" className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)' }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '200px',
        height: '200px',
        border: '2px solid rgba(74,57,192,0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '-25px',
        right: '-25px',
        width: '150px',
        height: '150px',
        border: '2px solid rgba(74,57,192,0.08)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="AI Detection"
          title={<>130+ Pathologies Detected with <span className="gradient-text">Clinical Accuracy</span></>}
          description="Our AI models are trained on millions of annotated dental images, achieving clinical-grade accuracy across all major pathology categories."
        />

        <div className="max-w-4xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              height: '350px',
              marginBottom: '50px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #F5F3FF 0%, #E4E1FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4A39C0',
              fontWeight: 500,
              border: '1px solid rgba(74,57,192,0.1)',
            }}
          >
            AI Detection Interface
          </motion.div>

          {/* Detection bars */}
          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {detections.map((detection, i) => (
              <motion.div
                key={detection.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  padding: '16px 20px',
                  background: '#FAFAFA',
                  borderRadius: '16px',
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm sm:text-base font-medium text-[#1A1A2E]">{detection.label}</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'white',
                    background: 'linear-gradient(135deg, #4A39C0 0%, #8B5CF6 100%)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                  }}>
                    {detection.accuracy}%
                  </span>
                </div>
                <div className="h-3 bg-[#E4E1FF] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${detection.accuracy}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                    className="h-full rounded-full relative overflow-hidden"
                    style={{ background: 'linear-gradient(90deg, #4A39C0 0%, #8B5CF6 50%, #FF3254 100%)' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
