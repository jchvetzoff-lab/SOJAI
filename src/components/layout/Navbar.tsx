'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '@/lib/constants';
import { useAnimationStore } from '@/hooks/useAnimationStore';

const PLATFORM_LINKS = [
  { label: 'Dashboard', href: '/platform', desc: 'Overview & patients' },
  { label: '2D Viewer', href: '/platform/viewer', desc: 'Radiological analysis' },
  { label: 'AI Detection', href: '/platform/detection', desc: 'Pathology detection' },
  { label: 'Reports', href: '/platform/report', desc: 'PDF report generator' },
  { label: '3D Viewer', href: '/platform/3d', desc: '3D jaw segmentation' },
  { label: 'Superimposition', href: '/platform/superimposition', desc: 'Scan comparison' },
  { label: 'Implant Planning', href: '/platform/implant', desc: 'Implant placement' },
  { label: 'Orthodontic', href: '/platform/orthodontic', desc: 'Cephalometric analysis' },
  { label: 'Periodontal', href: '/platform/periodontal', desc: 'Pocket charting' },
  { label: 'Analytics', href: '/platform/analytics', desc: 'Practice insights' },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [mobilePlatformOpen, setMobilePlatformOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY.current;
      const isAtTop = currentScrollY < 20;
      const isAnimationDone = sceneOpacity < 0.1;

      if (isAtTop) {
        setVisible(true);
      } else if (isAnimationDone) {
        setVisible(isScrollingUp);
      } else {
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sceneOpacity]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
      <div className="w-full max-w-[1200px] mx-auto h-16 sm:h-18 md:h-20 flex flex-row items-center justify-between" style={{ paddingLeft: '60px', paddingRight: '24px' }}>
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

          {/* Platform dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setPlatformOpen(!platformOpen)}
              className="flex items-center gap-1 text-[15px] text-[#1A1A2E]/60 hover:text-[#4A39C0] transition-colors duration-200"
            >
              Platform
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${platformOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {platformOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-3 w-[340px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                  style={{ backdropFilter: 'blur(20px)' }}
                >
                  <div className="p-2">
                    <div className="px-3 py-2 mb-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Platform Demo</span>
                    </div>
                    {PLATFORM_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={() => setPlatformOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F9F8FF] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#E4E1FF] flex items-center justify-center group-hover:bg-[#4A39C0] transition-colors">
                          <div className="w-2 h-2 rounded-full bg-[#4A39C0] group-hover:bg-white transition-colors" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#1A1A2E]">{link.label}</div>
                          <div className="text-[11px] text-gray-400">{link.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 p-3">
                    <a
                      href="/platform"
                      onClick={() => setPlatformOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#4A39C0] text-white rounded-xl text-sm font-medium hover:bg-[#3a2da0] transition-colors"
                    >
                      Open Full Platform
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="/platform"
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

              {/* Mobile platform section */}
              <button
                onClick={() => setMobilePlatformOpen(!mobilePlatformOpen)}
                className="flex items-center justify-between text-[#1A1A2E]/70 hover:text-[#4A39C0] transition-colors py-2 text-sm sm:text-base"
              >
                Platform
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`transition-transform ${mobilePlatformOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <AnimatePresence>
                {mobilePlatformOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-4 flex flex-col gap-1 overflow-hidden"
                  >
                    {PLATFORM_LINKS.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="text-sm text-[#1A1A2E]/50 hover:text-[#4A39C0] transition-colors py-1.5"
                        onClick={() => { setMobileOpen(false); setMobilePlatformOpen(false); }}
                      >
                        {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

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
