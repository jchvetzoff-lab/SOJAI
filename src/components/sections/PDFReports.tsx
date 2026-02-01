'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const features = [
  'Auto-generated findings summary',
  'Annotated radiographic images',
  'Treatment recommendations',
  'Custom branding & templates',
  'Multi-language support',
  'Digital signature ready',
];

export default function PDFReports() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)' }}>
      <div className="container px-4 sm:px-6">
        <SectionHeading
          tag="Reports"
          title="Professional PDF Reports"
          description="Generate comprehensive, patient-ready reports with a single click. Fully customizable templates with your branding."
        />

        <div className="max-w-4xl mx-auto">
          {/* PDF Preview mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card shadow-xl"
            style={{ maxWidth: '800px', width: '100%', margin: '0 auto 60px auto', padding: '40px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', paddingBottom: '30px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <div style={{ fontSize: '14px', color: 'rgba(26,26,46,0.4)', marginBottom: '6px' }}>SOJAI Report</div>
                <div style={{ fontWeight: 600, color: '#1A1A2E', fontSize: '18px' }}>Diagnostic Analysis</div>
              </div>
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: '#E4E1FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#4A39C0', fontWeight: 'bold', fontSize: '18px' }}>S</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '75%' }} />
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '100%' }} />
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '85%' }} />
              <div className="img-placeholder" style={{ height: '250px', margin: '30px 0' }}>
                Annotated Image
              </div>
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '65%' }} />
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '100%' }} />
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '80%' }} />
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '90%' }} />
              <div style={{ height: '12px', background: '#F9F8FF', borderRadius: '6px', width: '70%' }} />
            </div>
          </motion.div>

          {/* Features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-center gap-3 text-center"
              >
                <svg className="w-5 h-5 text-[#4A39C0] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm sm:text-base text-[#1A1A2E]/70">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
