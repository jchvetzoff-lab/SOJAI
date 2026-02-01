'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const integrations = [
  { name: 'DICOM', category: 'Standard' },
  { name: 'STL / OBJ', category: 'File Format' },
  { name: 'Dentsply Sirona', category: 'CBCT' },
  { name: 'Planmeca', category: 'CBCT' },
  { name: 'Carestream', category: 'Imaging' },
  { name: 'Vatech', category: 'CBCT' },
  { name: 'REST API', category: 'Developer' },
  { name: 'PACS', category: 'Infrastructure' },
];

export default function Integrations() {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Standard': return '#4A39C0';
      case 'File Format': return '#8B5CF6';
      case 'CBCT': return '#FF3254';
      case 'Imaging': return '#00C8C8';
      case 'Developer': return '#FFB800';
      case 'Infrastructure': return '#4A39C0';
      default: return '#4A39C0';
    }
  };

  return (
    <section id="integrations" className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Decorative grid pattern */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 6px)',
        gap: '10px',
        opacity: 0.2,
        pointerEvents: 'none',
      }}>
        {[...Array(16)].map((_, i) => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4A39C0' }} />
        ))}
      </div>

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Integrations"
          title={<>Works With <span style={{ color: '#4A39C0' }}>Your Equipment</span></>}
          description="Seamless integration with all major dental imaging equipment and software."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-4xl mx-auto">
          {integrations.map((integration, i) => {
            const color = getCategoryColor(integration.category);
            return (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                style={{
                  padding: '24px 16px',
                  background: 'white',
                  borderRadius: '20px',
                  textAlign: 'center',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  margin: '0 auto 16px auto',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${color}20`,
                }}>
                  <span style={{ color: color, fontSize: '14px', fontWeight: 'bold' }}>
                    {integration.name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <h4 style={{ fontWeight: 600, color: '#1A1A2E', fontSize: '15px', marginBottom: '6px' }}>{integration.name}</h4>
                <span style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  background: `${color}10`,
                  color: color,
                  fontWeight: 500,
                }}>{integration.category}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
