'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const papers = [
  {
    title: 'AI Accuracy in Periapical Pathology Detection',
    category: 'Research',
    date: 'January 2026',
    description: 'Comparing SOJAI AI detection accuracy with board-certified radiologists across 10,000 cases.',
  },
  {
    title: 'CBCT Volume Analysis: A New Paradigm',
    category: 'White Paper',
    date: 'December 2025',
    description: 'How 3D volumetric analysis is transforming dental diagnostics and treatment planning.',
  },
  {
    title: 'Automated Tooth Segmentation Validation',
    category: 'Clinical Study',
    date: 'November 2025',
    description: 'Multi-center study validating automated 3D segmentation accuracy.',
  },
];

export default function WhitePapers() {
  const categoryColors: Record<string, string> = {
    'Research': '#4A39C0',
    'White Paper': '#8B5CF6',
    'Clinical Study': '#FF3254',
  };

  return (
    <section id="resources" className="section-padding" style={{ background: '#FFFFFF' }}>
      <div className="container px-4 sm:px-6">
        <SectionHeading
          tag="Resources"
          title={<>Research & <span className="gradient-text">White Papers</span></>}
          description="Peer-reviewed research and technical documentation backing our AI technology."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {papers.map((paper, i) => {
            const color = categoryColors[paper.category] || '#4A39C0';
            return (
              <motion.div
                key={paper.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                style={{
                  padding: '32px',
                  background: 'white',
                  borderRadius: '24px',
                  textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Top accent line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${color} 0%, ${color}60 100%)`,
                }} />

                {/* PDF icon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 20px auto',
                  borderRadius: '16px',
                  background: `${color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '10px' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '100px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    background: `${color}15`,
                    color: color,
                  }}>
                    {paper.category}
                  </span>
                  <span className="text-xs sm:text-sm text-[#1A1A2E]/50">{paper.date}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#1A1A2E] leading-snug" style={{ marginBottom: '16px' }}>{paper.title}</h3>
                <p className="text-small" style={{ marginBottom: '24px' }}>{paper.description}</p>
                <a
                  href="#"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '100px',
                    background: `${color}10`,
                    color: color,
                    fontWeight: 600,
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Download PDF
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
