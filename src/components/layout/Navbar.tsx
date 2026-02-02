'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { useAnimationStore } from '@/hooks/useAnimationStore';

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isAtTop = currentScrollY < 20;
      const isAnimationDone = sceneOpacity < 0.1;

      if (isAtTop) {
        // At top of page - show navbar
        setVisible(true);
      } else if (isAnimationDone) {
        // After animation - show on scroll up, hide on scroll down
        setVisible(isScrollingUp);
      } else {
        // During animation - hide navbar
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sceneOpacity]);

  return (
    <nav
      className="fixed left-0 right-0 z-50 transition-all duration-300"
      style={{
        top: visible ? '0' : '-100px',
        opacity: visible ? 1 : 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="w-full max-w-[1200px] mx-auto h-16 sm:h-18 md:h-20 flex flex-row items-center justify-between pl-12 pr-4 sm:pl-16 sm:pr-6">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#4A39C0] flex items-center justify-center">
            <span className="text-white font-bold text-base sm:text-lg font-[family-name:var(--font-playfair)]">S</span>
          </div>
          <span className="text-[#1A1A2E] text-lg sm:text-xl font-bold tracking-tight">
            SOJ<span className="text-[#4A39C0]">AI</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] text-[#1A1A2E]/60 hover:text-[#4A39C0] transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#"
            className="text-[15px] text-[#1A1A2E]/70 hover:text-[#4A39C0] transition-colors"
          >
            Login
          </a>
          <a href="#book-demo" className="btn btn-primary py-3 px-6 text-[15px]">
            Book a Demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-[#1A1A2E]"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-black/5"
          >
            <div className="container py-4 sm:py-6 flex flex-col gap-2 sm:gap-4 px-4 sm:px-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-[#1A1A2E]/70 hover:text-[#4A39C0] transition-colors py-2 text-sm sm:text-base"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#book-demo"
                className="btn btn-primary text-center mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Book a Demo
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
