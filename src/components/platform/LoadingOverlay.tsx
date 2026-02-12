'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!visible) {
      setProgress(0);
      return;
    }
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const remaining = 90 - prev;
        return prev + remaining * 0.03;
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
          className="absolute inset-0 z-50 bg-[#0a0a1a]/80 backdrop-blur-sm flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#111C32] rounded-2xl border border-white/[0.08] p-8 max-w-sm w-full mx-4 text-center"
          >
            {/* Spinner */}
            <div className="w-16 h-16 mx-auto mb-4 relative">
              <svg className="animate-spin w-full h-full" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle
                  cx="25" cy="25" r="20" fill="none" stroke="#3B82F6" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="80 126"
                />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-[#E2E8F0] mb-1">Analyzing your dental scan...</h3>
            <p className="text-sm text-[#64748B] mb-4">Claude AI is examining the radiograph</p>

            {/* Progress bar */}
            <div className="w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-[#475569] mt-2">{Math.round(progress)}% complete</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
