'use client';

import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import JawModel from '@/components/three/JawModel';
import ImplantModel from '@/components/three/ImplantModel';

const implantSizes = [
  { label: '3.5 x 10mm', diameter: 3.5, length: 10 },
  { label: '4.0 x 11.5mm', diameter: 4.0, length: 11.5 },
  { label: '4.5 x 13mm', diameter: 4.5, length: 13 },
  { label: '5.0 x 10mm', diameter: 5.0, length: 10 },
];

export default function ImplantPage() {
  const [selectedImplant, setSelectedImplant] = useState(1);
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'warning' | 'danger'>('safe');

  const safetyColor = safetyStatus === 'safe' ? 'text-emerald-500' : safetyStatus === 'warning' ? 'text-amber-500' : 'text-red-500';
  const safetyBg = safetyStatus === 'safe' ? 'bg-emerald-500/10' : safetyStatus === 'warning' ? 'bg-amber-500/10' : 'bg-red-500/10';

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)]">
      <div className="mb-6">
        <h1 className="text-4xl tracking-tight font-bold text-[#E2E8F0]">Implant Planning</h1>
        <p className="text-lg text-[#64748B] mt-3">Position and validate implant placement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-7 h-[calc(100%-80px)]">
        {/* 3D Viewer */}
        <div className="lg:col-span-3 bg-[#0a0a1a] rounded-2xl overflow-hidden relative">
          <Canvas camera={{ position: [0, 3, 6], fov: 40 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <directionalLight position={[-3, 3, -3]} intensity={0.3} />
            <JawModel showTeeth showNerves showBone={false} />
            <ImplantModel
              position={[0.8, 0.2, 0.3]}
              safetyStatus={safetyStatus}
            />
            <OrbitControls enablePan enableZoom enableRotate minDistance={2} maxDistance={10} />
            <Environment preset="studio" />
          </Canvas>

          {/* Safety status indicator */}
          <div className={`absolute top-4 left-4 ${safetyBg} px-4 py-2 rounded-xl`}>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${safetyStatus === 'safe' ? 'bg-emerald-500' : safetyStatus === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-medium ${safetyColor}`}>
                {safetyStatus === 'safe' ? 'Safe Placement' : safetyStatus === 'warning' ? 'Caution — Close to Nerve' : 'Danger — Nerve Collision'}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-[#0F1A2E]/90 backdrop-blur-sm rounded-xl px-4 py-2 text-xs text-[#64748B]">
            Drag to rotate &middot; Scroll to zoom
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6 overflow-y-auto">
          {/* Implant selector */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">Implant Size</h3>
            <div className="space-y-2">
              {implantSizes.map((imp, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImplant(i)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedImplant === i
                      ? 'bg-[#3B82F6]/15 text-[#3B82F6] font-medium'
                      : 'text-[#94A3B8] hover:bg-white/[0.04]'
                  }`}
                >
                  {imp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Safety simulation */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">Safety Check</h3>
            <div className="space-y-2">
              {(['safe', 'warning', 'danger'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSafetyStatus(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    safetyStatus === s ? 'bg-white/[0.06] font-medium' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    s === 'safe' ? 'bg-emerald-500' : s === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">Measurements</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Bone Height</span>
                <span className="font-medium text-[#E2E8F0]">14.2 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Bone Width</span>
                <span className="font-medium text-[#E2E8F0]">8.5 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">To IAN Canal</span>
                <span className="font-medium text-emerald-500">3.8 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">To Adjacent Tooth</span>
                <span className="font-medium text-[#E2E8F0]">2.1 mm</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <button className="w-full py-3 bg-[#3B82F6] text-white rounded-xl text-sm font-medium hover:bg-[#2563EB] transition-colors">
            Generate Surgical Guide
          </button>
        </div>
      </div>
    </div>
  );
}
