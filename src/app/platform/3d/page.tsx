'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import JawModel from '@/components/three/JawModel';

export default function Viewer3DPage() {
  const [showTeeth, setShowTeeth] = useState(true);
  const [showNerves, setShowNerves] = useState(true);
  const [showBone, setShowBone] = useState(true);
  const [showSinus, setShowSinus] = useState(false);

  const toggles = [
    { label: 'Teeth', active: showTeeth, toggle: () => setShowTeeth(!showTeeth), color: '#F5F0E8' },
    { label: 'Nerves', active: showNerves, toggle: () => setShowNerves(!showNerves), color: '#FF3254' },
    { label: 'Bone', active: showBone, toggle: () => setShowBone(!showBone), color: '#E8D8C8' },
    { label: 'Sinus', active: showSinus, toggle: () => setShowSinus(!showSinus), color: '#87CEEB' },
  ];

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Page title */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">3D Viewer</h1>
        <p className="text-sm text-gray-500 mt-1">Interactive 3D jaw model — rotate, zoom and toggle layers</p>
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

        {/* Floating controls */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-[#1A1A2E]">Layers</h3>
          {toggles.map((t) => (
            <label key={t.label} className="flex items-center gap-3 cursor-pointer">
              <button
                onClick={t.toggle}
                className={`w-8 h-4 rounded-full transition-colors ${t.active ? 'bg-[#4A39C0]' : 'bg-gray-200'}`}
              >
                <span className={`block w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5 ${t.active ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
              <span className="flex items-center gap-2 text-sm text-gray-700">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                {t.label}
              </span>
            </label>
          ))}
        </div>

        {/* Info badge */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2 text-xs text-gray-500">
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
