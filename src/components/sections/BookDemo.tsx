'use client';

import { motion } from 'framer-motion';

export default function BookDemo() {
  return (
    <section id="book-demo" className="section-padding relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4A39C0 0%, #6B5DD3 50%, #8B5CF6 100%)' }}>
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-10 w-20 h-20 bg-white/10 rounded-full animate-float" />
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      {/* Additional decorative elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '150px',
        height: '150px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        width: '80px',
        height: '80px',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />
      {/* Floating dots */}
      <div className="animate-float" style={{ position: 'absolute', top: '30%', right: '25%', width: '8px', height: '8px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />
      <div className="animate-float" style={{ position: 'absolute', bottom: '40%', left: '20%', width: '6px', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', animationDelay: '0.5s' }} />
      <div className="animate-float" style={{ position: 'absolute', top: '60%', right: '10%', width: '10px', height: '10px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', animationDelay: '1.5s' }} />

      <div className="container text-center px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] text-white leading-tight" style={{ marginBottom: '30px' }}>
            Ready to Transform Your Practice?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed" style={{ marginBottom: '40px' }}>
            Join 10,000+ dental professionals using AI-powered diagnostics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4" style={{ marginBottom: '30px' }}>
            <a href="#" className="btn bg-white text-[#4A39C0] hover:bg-white/90 w-full sm:w-auto">
              Book a Demo
            </a>
            <a href="/platform" className="btn border-2 border-white/30 text-white hover:bg-white/10 w-full sm:w-auto">
              Try Platform Demo
            </a>
          </div>
          <p className="text-xs sm:text-sm text-white/50">
            Free 14-day trial &bull; No credit card required &bull; HIPAA compliant
          </p>
        </motion.div>
      </div>
    </section>
  );
}
