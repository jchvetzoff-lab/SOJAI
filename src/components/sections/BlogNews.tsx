'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const articles = [
  {
    title: 'How AI is Reshaping Dental Radiology in 2026',
    category: 'Industry',
    date: 'Jan 15, 2026',
    excerpt: 'Explore the latest advancements in AI-powered dental imaging.',
  },
  {
    title: 'SOJAI Achieves FDA Clearance',
    category: 'Company News',
    date: 'Jan 8, 2026',
    excerpt: 'FDA 510(k) clearance for periapical pathology detection module.',
  },
  {
    title: '5 Ways AI Improves Patient Communication',
    category: 'Tips',
    date: 'Dec 22, 2025',
    excerpt: 'How AI-generated reports help patients understand their dental health.',
  },
];

export default function BlogNews() {
  const categoryColors: Record<string, string> = {
    'Industry': '#4A39C0',
    'Company News': '#FF3254',
    'Tips': '#00C8C8',
  };

  return (
    <section className="section-padding" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)' }}>
      {/* Decorative element */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '-100px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(74,57,192,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Blog"
          title={<>Latest News & <span style={{ color: '#4A39C0' }}>Insights</span></>}
          description="Stay up to date with dental AI technology and product updates."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {articles.map((article, i) => {
            const color = categoryColors[article.category] || '#4A39C0';
            return (
              <motion.article
                key={article.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'white',
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                }}
              >
                <div style={{
                  height: '180px',
                  background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: color,
                  fontWeight: 500,
                  position: 'relative',
                }}>
                  {/* Decorative circles on image */}
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: `2px solid ${color}30`,
                  }} />
                  Article Image
                </div>
                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
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
                      {article.category}
                    </span>
                    <span className="text-xs sm:text-sm text-[#1A1A2E]/50">{article.date}</span>
                  </div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#1A1A2E',
                    lineHeight: 1.4,
                    marginBottom: '16px',
                    textAlign: 'center',
                    transition: 'color 0.3s ease',
                  }}>
                    {article.title}
                  </h3>
                  <p className="text-small text-center">{article.excerpt}</p>

                  {/* Read more link */}
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <span style={{
                      color: color,
                      fontWeight: 600,
                      fontSize: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      Read More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
