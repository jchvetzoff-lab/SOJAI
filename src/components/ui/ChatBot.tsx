'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimationStore } from '@/hooks/useAnimationStore';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const sceneOpacity = useAnimationStore((s) => s.sceneOpacity);

  // Only show after tooth animation is done
  const isVisible = sceneOpacity < 0.1;

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setHasNotification(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
          }}
        >
          {/* Chat window */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: '80px',
                  right: '0',
                  width: '340px',
                  background: 'white',
                  borderRadius: '24px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                }}
              >
                {/* Header */}
                <div style={{
                  background: 'linear-gradient(135deg, #4A39C0 0%, #6B5DD3 100%)',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}>
                  {/* Mini tooth logo */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'white',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <ToothFace size={28} />
                  </div>
                  <div>
                    <div style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>SOJAI Assistant</div>
                    <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%' }} />
                      Online
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ padding: '20px', minHeight: '200px', background: '#F9F8FF' }}>
                  <div style={{
                    background: 'white',
                    padding: '14px 18px',
                    borderRadius: '18px',
                    borderTopLeftRadius: '4px',
                    maxWidth: '85%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  }}>
                    <p style={{ fontSize: '14px', color: '#1A1A2E', lineHeight: 1.5, margin: 0 }}>
                      Hi! I'm your SOJAI dental assistant. How can I help you today?
                    </p>
                  </div>
                  <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {['Book a demo', 'Pricing', 'Features'].map((suggestion) => (
                      <button
                        key={suggestion}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '100px',
                          border: '1px solid #E4E1FF',
                          background: 'white',
                          color: '#4A39C0',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid #E4E1FF',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}>
                  <input
                    type="text"
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '100px',
                      border: '1px solid #E4E1FF',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <button style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4A39C0 0%, #6B5DD3 100%)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating button */}
          <motion.button
            onClick={handleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #4A39C0 0%, #6B5DD3 100%)',
              border: 'none',
              boxShadow: '0 8px 25px rgba(74,57,192,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Notification dot */}
            {hasNotification && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '20px',
                  height: '20px',
                  background: '#FF3254',
                  borderRadius: '50%',
                  border: '3px solid white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  color: 'white',
                  fontWeight: 'bold',
                }}
              >
                1
              </motion.div>
            )}

            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <ToothFace size={36} color="white" />
            )}
          </motion.button>

          {/* Subtle hint tooltip */}
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
              style={{
                position: 'absolute',
                right: '76px',
                bottom: '16px',
                background: 'white',
                padding: '10px 16px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                whiteSpace: 'nowrap',
                fontSize: '14px',
                color: '#1A1A2E',
              }}
            >
              Need help? <span style={{ color: '#4A39C0', fontWeight: 600 }}>Ask me!</span>
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
                width: '12px',
                height: '12px',
                background: 'white',
              }} />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Cute tooth face component
function ToothFace({ size = 32, color = '#4A39C0' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Tooth shape */}
      <path
        d="M16 4C12 4 9 6 8 10C7 14 8 18 9 22C10 26 11 28 13 28C14.5 28 15 26 16 26C17 26 17.5 28 19 28C21 28 22 26 23 22C24 18 25 14 24 10C23 6 20 4 16 4Z"
        fill={color}
      />
      {/* Left eye */}
      <circle cx="12" cy="12" r="2" fill={color === 'white' ? '#4A39C0' : 'white'} />
      {/* Right eye */}
      <circle cx="20" cy="12" r="2" fill={color === 'white' ? '#4A39C0' : 'white'} />
      {/* Smile */}
      <path
        d="M12 17C12 17 14 20 16 20C18 20 20 17 20 17"
        stroke={color === 'white' ? '#4A39C0' : 'white'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
