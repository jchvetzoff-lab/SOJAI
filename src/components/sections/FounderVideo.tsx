'use client';

import { motion } from 'framer-motion';

export default function FounderVideo() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #F8F9FA 0%, #F3F4F6 100%)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-50px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(74,57,192,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      <div className="container px-4 sm:px-6" style={{ position: 'relative', zIndex: 1 }}>
        <div className="text-center max-w-xs sm:max-w-md md:max-w-xl lg:max-w-3xl mx-auto" style={{ marginBottom: '50px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ marginBottom: '29px' }}>
              <span className="badge badge-purple">Our Vision</span>
            </div>
            <h2 className="heading-section font-[family-name:var(--font-playfair)]" style={{ marginBottom: '24px' }}>
              A Message from Our <span className="gradient-text">Founder</span>
            </h2>
            <p className="text-body">
              Learn how SOJAI is revolutionizing dental diagnostics through the power of artificial intelligence.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative',
            borderRadius: '24px',
            overflow: 'hidden',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            height: '450px',
            background: 'linear-gradient(135deg, #E4E1FF 0%, #D4D0FF 100%)',
            boxShadow: '0 30px 60px rgba(74,57,192,0.2)',
          }}
        >
          {/* Decorative shapes inside video */}
          <div style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            width: '80px',
            height: '80px',
            border: '2px solid rgba(74,57,192,0.2)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute',
            top: '50px',
            right: '50px',
            width: '40px',
            height: '40px',
            border: '2px solid rgba(74,57,192,0.15)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }} />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4A39C0 0%, #6B5DD3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 40px rgba(74,57,192,0.4)',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <svg
                style={{ width: '32px', height: '32px', color: 'white', marginLeft: '4px' }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.button>
          </div>

          {/* Bottom info card */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            background: 'white',
            padding: '16px 24px',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}>
            <p style={{ fontWeight: 600, color: '#1A1A2E', fontSize: '16px', marginBottom: '4px' }}>Dr. Fromental</p>
            <p style={{ color: 'rgba(26,26,46,0.6)', fontSize: '14px' }}>CEO & Co-Founder</p>
          </div>

          {/* Duration badge */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            background: 'rgba(26,26,46,0.8)',
            padding: '8px 16px',
            borderRadius: '100px',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
          }}>
            3:45
          </div>

          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'rgba(74,57,192,0.2)',
          }}>
            <div style={{
              height: '100%',
              width: '33%',
              background: 'linear-gradient(90deg, #4A39C0 0%, #8B5CF6 100%)',
              borderRadius: '0 4px 4px 0',
            }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
