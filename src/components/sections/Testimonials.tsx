'use client';

import { motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';

const testimonials = [
  {
    quote: "SOJAI has transformed how we diagnose. The AI catches things I might have missed, and the reports save hours of documentation time.",
    author: "Dr. Sarah Chen",
    role: "Oral Surgeon, Boston",
    initials: "SC",
  },
  {
    quote: "The accuracy is remarkable. My patients appreciate the detailed visual explanations, and it's made treatment acceptance much smoother.",
    author: "Dr. Michael Roberts",
    role: "General Dentist, London",
    initials: "MR",
  },
  {
    quote: "Integration with our CBCT was seamless. The team support is excellent, and the platform keeps getting better with each update.",
    author: "Dr. Emma Larsson",
    role: "Endodontist, Stockholm",
    initials: "EL",
  },
];

export default function Testimonials() {
  const gradientColors = ['#4A39C0', '#8B5CF6', '#FF3254'];

  return (
    <section id="testimonials" className="section-padding" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative quote marks */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        fontSize: '200px',
        fontFamily: 'serif',
        color: 'rgba(74,57,192,0.05)',
        lineHeight: 1,
        pointerEvents: 'none',
      }}>"</div>

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <SectionHeading
          tag="Testimonials"
          title={<>Trusted by <span className="gradient-text">Dental Professionals</span></>}
          description="See what leading practitioners are saying about SOJAI."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="card text-center"
              style={{
                cursor: 'pointer',
                background: 'white',
                borderLeft: `4px solid ${gradientColors[i]}`,
              }}
            >
              <div className="flex gap-1 mb-4 sm:mb-6 justify-center">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} style={{ width: '20px', height: '20px', color: '#FFB800' }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-body mb-6 sm:mb-8" style={{ fontStyle: 'italic' }}>
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              <div className="flex items-center justify-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-black/5">
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${gradientColors[i]}20 0%, ${gradientColors[i]}40 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ color: gradientColors[i], fontSize: '14px', fontWeight: 'bold' }}>{testimonial.initials}</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#1A1A2E] text-sm sm:text-base">{testimonial.author}</div>
                  <div className="text-xs sm:text-sm text-[#1A1A2E]/50">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
