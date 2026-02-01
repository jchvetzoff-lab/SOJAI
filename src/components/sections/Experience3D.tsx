'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const tabs = [
  {
    id: 'segmentation',
    label: 'Segmentation',
    title: '3D Tooth Segmentation',
    description: 'Automatic individual tooth segmentation from CBCT volumes. Each tooth is isolated, numbered, and color-coded.',
    features: ['Individual tooth isolation', 'Automatic numbering (FDI/Universal)', 'Color-coded visualization', 'Export as STL'],
  },
  {
    id: 'multiplanar',
    label: 'Multiplanar',
    title: 'Multiplanar Reconstruction',
    description: 'Navigate through axial, sagittal, and coronal views simultaneously with cross-reference in real-time.',
    features: ['Axial, sagittal, coronal views', 'Cross-hair synchronization', 'Measurement tools', 'Density mapping'],
  },
  {
    id: 'superimposition',
    label: 'Superimposition',
    title: 'Scan Superimposition',
    description: 'Compare scans over time with precise 3D registration. Track bone changes and treatment progress.',
    features: ['Temporal comparison', 'Bone level tracking', 'Treatment monitoring', 'Automatic alignment'],
  },
];

export default function Experience3D() {
  const [activeTab, setActiveTab] = useState('segmentation');
  const active = tabs.find((t) => t.id === activeTab)!;

  return (
    <section className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="container px-4 sm:px-6">
        <SectionHeading
          tag="3D Experience"
          title="Immersive 3D Visualization"
        />

        {/* Tabs */}
        <div className="flex justify-center" style={{ marginTop: '-40px', marginBottom: '60px', gap: '16px' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '100px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.5px',
                transition: 'all 0.3s ease',
                background: activeTab === tab.id ? '#4A39C0' : '#E4E1FF',
                color: activeTab === tab.id ? '#FFFFFF' : '#4A39C0',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            {/* Visual placeholder */}
            <div
              className="img-placeholder rounded-2xl"
              style={{
                aspectRatio: '16/9',
                maxHeight: '450px',
                marginBottom: '50px',
                width: '100%',
                margin: '0 auto 50px auto'
              }}
            >
              3D {active.label} Preview
            </div>

            {/* Description */}
            <div style={{ textAlign: 'center', marginBottom: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3
                className="font-bold text-[#1A1A2E] font-[family-name:var(--font-playfair)]"
                style={{ fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}
              >
                {active.title}
              </h3>
              <p style={{ lineHeight: '1.8', textAlign: 'center', maxWidth: '600px', color: 'rgba(26,26,46,0.6)', fontSize: '18px' }}>
                {active.description}
              </p>
            </div>

            {/* Image placeholder */}
            <div
              className="img-placeholder rounded-2xl"
              style={{
                width: '100%',
                height: '300px',
                marginBottom: '50px',
              }}
            >
              {active.title} Preview
            </div>

            {/* Features */}
            <div className="flex flex-wrap justify-center" style={{ gap: '12px' }}>
              {active.features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#E4E1FF',
                    borderRadius: '100px',
                  }}
                >
                  <svg style={{ width: '16px', height: '16px', color: '#4A39C0', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ fontSize: '13px', color: '#4A39C0', fontWeight: 500 }}>{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
