'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) { setProgress(0); return; }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + (90 - prev) * 0.03;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[#141416] rounded-lg border border-white/[0.08] p-6 max-w-xs w-full mx-4 text-center"
          >
            <div className="w-12 h-12 mx-auto mb-3 relative">
              <svg className="animate-spin w-full h-full" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                <circle cx="25" cy="25" r="20" fill="none" stroke="#5B5BD6" strokeWidth="3" strokeLinecap="round" strokeDasharray="80 126" />
              </svg>
            </div>
            <h3 className="text-[14px] font-semibold text-[#EDEDEF] mb-1">Analyzing scan...</h3>
            <p className="text-[12px] text-[#5C5C5F] mb-3">Claude AI is examining the radiograph</p>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <motion.div
                className="h-full bg-[#5B5BD6] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-[11px] text-[#5C5C5F] mt-2">{Math.round(progress)}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
