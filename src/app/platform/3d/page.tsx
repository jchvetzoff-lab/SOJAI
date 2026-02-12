'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import JawModel from '@/components/three/JawModel';

export default function Viewer3DPage() {
  const [showTeeth, setShowTeeth] = useState(true);
  const [showNerves, setShowNerves] = useState(true);
  const [showBone, setShowBone] = useState(true);
  const [showSinus, setShowSinus] = useState(false);
  const [showPulp, setShowPulp] = useState(false);
  const [showGingiva, setShowGingiva] = useState(false);

  const toggles = [
    { label: 'Teeth', active: showTeeth, toggle: () => setShowTeeth(!showTeeth), color: '#F5F0E8' },
    { label: 'Nerves', active: showNerves, toggle: () => setShowNerves(!showNerves), color: '#FF3254' },
    { label: 'Bone', active: showBone, toggle: () => setShowBone(!showBone), color: '#E8D8C8' },
    { label: 'Sinus', active: showSinus, toggle: () => setShowSinus(!showSinus), color: '#87CEEB' },
    { label: 'Pulp', active: showPulp, toggle: () => setShowPulp(!showPulp), color: '#DC2626' },
    { label: 'Gingiva', active: showGingiva, toggle: () => setShowGingiva(!showGingiva), color: '#F9A8D4' },
  ];

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-3xl tracking-tight font-bold text-[#1A1A2E]">3D Viewer</h1>
        <p className="text-sm text-gray-400 mt-1">Interactive 3D jaw model — rotate, zoom and toggle layers</p>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#0a0a1a]">
        <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-5, 3, -5]} intensity={0.3} />
          <JawModel
            showTeeth={showTeeth}
            showNerves={showNerves}
            showBone={showBone}
            showSinus={showSinus}
          />
          <OrbitControls
            enablePan
            enableZoom
            enableRotate
            minDistance={2}
            maxDistance={12}
          />
          <Environment preset="studio" />
        </Canvas>

        {/* Dark floating layer panel — Diagnocat style */}
        <div className="absolute top-4 left-4 bg-[#1A1A2E]/95 backdrop-blur-sm rounded-2xl shadow-2xl p-5 space-y-3 min-w-[200px]">
          <h3 className="text-sm font-semibold text-white/90">Layers</h3>
          {toggles.map((t) => (
            <label key={t.label} className="flex items-center gap-3 cursor-pointer group">
              {/* Eye icon */}
              <button
                onClick={t.toggle}
                className="w-6 h-6 flex items-center justify-center transition-opacity"
                style={{ opacity: t.active ? 1 : 0.3 }}
              >
                {t.active ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>

              {/* Color dot */}
              <span
                className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: t.color, opacity: t.active ? 1 : 0.3 }}
              />

              {/* Label */}
              <span
                className="text-sm font-medium transition-opacity"
                style={{ color: t.active ? '#E5E7EB' : '#6B7280' }}
              >
                {t.label}
              </span>

              {/* Toggle switch colored to match layer */}
              <button
                onClick={t.toggle}
                className="ml-auto w-9 h-5 rounded-full transition-colors relative"
                style={{ backgroundColor: t.active ? t.color : '#374151' }}
              >
                <span
                  className={`block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${
                    t.active ? 'left-[18px]' : 'left-[3px]'
                  }`}
                />
              </button>
            </label>
          ))}
        </div>

        {/* Info badge */}
        <div className="absolute top-4 right-4 bg-[#1A1A2E]/80 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 text-xs text-white/60">
          Drag to rotate &middot; Scroll to zoom &middot; Right-click to pan
        </div>

        {/* Export */}
        <div className="absolute bottom-4 right-4">
          <button className="bg-[#4A39C0] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#3a2da0] shadow-lg transition-colors">
            Export STL
          </button>
        </div>
      </div>
    </div>
  );
}
