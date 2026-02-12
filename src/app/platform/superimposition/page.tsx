'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SuperimpositionPage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeMode, setActiveMode] = useState<'slider' | '3d' | 'sidebyside'>('slider');
  const [opacity, setOpacity] = useState(50);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl tracking-tight font-bold text-[#1A1A2E]">Superimposition</h1>
        <p className="text-lg text-gray-400 mt-3">Compare scans from different dates</p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-1 shadow-sm flex">
          {(['slider', '3d', 'sidebyside'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setActiveMode(mode)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeMode === mode ? 'bg-[#4A39C0] text-white' : 'text-gray-500 hover:text-[#1A1A2E]'
              }`}
            >
              {mode === 'slider' ? 'Before / After' : mode === '3d' ? '3D Fusion' : 'Side by Side'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-gray-100 px-4 py-2 shadow-sm">
          <span className="text-xs text-gray-500">Date 1:</span>
          <span className="text-sm font-medium text-[#1A1A2E]">Jan 15, 2026</span>
          <span className="text-gray-300 mx-1">vs</span>
          <span className="text-xs text-gray-500">Date 2:</span>
          <span className="text-sm font-medium text-[#1A1A2E]">Feb 09, 2026</span>
        </div>
      </div>

      {/* Main viewer */}
      <div className="bg-white rounded-3xl border border-black/[0.06] shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300 overflow-hidden">
        {activeMode === 'slider' && (
          <div className="relative h-[500px] bg-[#0a0a1a]">
            {/* Before image (left side) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <svg viewBox="0 0 300 150" className="w-[500px] opacity-40">
                    <ellipse cx="150" cy="50" rx="140" ry="45" fill="none" stroke="#2a4a6a" strokeWidth="1.5" />
                    <ellipse cx="150" cy="100" rx="120" ry="40" fill="none" stroke="#2a4a6a" strokeWidth="1.5" />
                    {Array.from({ length: 14 }, (_, i) => (
                      <rect key={i} x={25 + i * 18} y={30} width={12} height={30} rx={3} fill="#1a3a5a" stroke="#2a4a6a" strokeWidth={0.5} />
                    ))}
                  </svg>
                  <div className="absolute top-4 left-4 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                    Jan 15, 2026
                  </div>
                </div>
              </div>
            </div>

            {/* After image (right side) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg viewBox="0 0 300 150" className="w-[500px] opacity-40">
                  <ellipse cx="150" cy="50" rx="140" ry="45" fill="none" stroke="#4a2a6a" strokeWidth="1.5" />
                  <ellipse cx="150" cy="100" rx="120" ry="40" fill="none" stroke="#4a2a6a" strokeWidth="1.5" />
                  {Array.from({ length: 14 }, (_, i) => (
                    <rect key={i} x={25 + i * 18} y={30} width={12} height={30} rx={3} fill="#3a1a5a" stroke="#4a2a6a" strokeWidth={0.5} />
                  ))}
                </svg>
                <div className="absolute top-4 right-4 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                  Feb 09, 2026
                </div>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-10 cursor-ew-resize"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A39C0" strokeWidth="2">
                  <path d="M8 6l-6 6 6 6" /><path d="M16 6l6 6-6 6" />
                </svg>
              </div>
            </div>

            {/* Slider input */}
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute bottom-0 left-0 right-0 w-full opacity-0 h-full cursor-ew-resize z-20"
            />
          </div>
        )}

        {activeMode === 'sidebyside' && (
          <div className="grid grid-cols-2 h-[500px]">
            <div className="bg-[#0a0a1a] flex items-center justify-center border-r border-gray-800 relative">
              <svg viewBox="0 0 300 150" className="w-[80%] opacity-40">
                <ellipse cx="150" cy="50" rx="140" ry="45" fill="none" stroke="#2a4a6a" strokeWidth="1.5" />
                <ellipse cx="150" cy="100" rx="120" ry="40" fill="none" stroke="#2a4a6a" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-4 left-4 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-medium">
                Jan 15, 2026
              </div>
            </div>
            <div className="bg-[#0a0a1a] flex items-center justify-center relative">
              <svg viewBox="0 0 300 150" className="w-[80%] opacity-40">
                <ellipse cx="150" cy="50" rx="140" ry="45" fill="none" stroke="#4a2a6a" strokeWidth="1.5" />
                <ellipse cx="150" cy="100" rx="120" ry="40" fill="none" stroke="#4a2a6a" strokeWidth="1.5" />
              </svg>
              <div className="absolute bottom-4 right-4 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-xs font-medium">
                Feb 09, 2026
              </div>
            </div>
          </div>
        )}

        {activeMode === '3d' && (
          <div className="h-[500px] bg-[#0a0a1a] flex items-center justify-center relative">
            <p className="text-white/40 text-sm">3D Fusion View — Interactive CBCT overlay</p>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <span className="text-xs text-white/60 shrink-0">Opacity</span>
              <input
                type="range"
                min={0}
                max={100}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="flex-1 accent-[#4A39C0]"
              />
              <span className="text-xs text-white/60 w-8 text-right">{opacity}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Analysis summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300">
          <div className="text-xs text-gray-400 mb-1">Alignment Score</div>
          <div className="text-2xl font-bold text-emerald-500">97.3%</div>
          <div className="text-xs text-gray-400 mt-1">Automatic registration</div>
        </div>
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300">
          <div className="text-xs text-gray-400 mb-1">Changes Detected</div>
          <div className="text-2xl font-bold text-[#FF3254]">3</div>
          <div className="text-xs text-gray-400 mt-1">Regions with significant change</div>
        </div>
        <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300">
          <div className="text-xs text-gray-400 mb-1">Time Between Scans</div>
          <div className="text-2xl font-bold text-[#4A39C0]">25 days</div>
          <div className="text-xs text-gray-400 mt-1">Jan 15 — Feb 09, 2026</div>
        </div>
      </div>
    </div>
  );
}
