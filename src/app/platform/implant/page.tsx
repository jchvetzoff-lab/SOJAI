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

  const safetyColor = safetyStatus === 'safe' ? 'text-[#30A46C]' : safetyStatus === 'warning' ? 'text-[#E5A836]' : 'text-[#E5484D]';
  const safetyBg = safetyStatus === 'safe' ? 'bg-[#30A46C]/10' : safetyStatus === 'warning' ? 'bg-[#E5A836]/10' : 'bg-[#E5484D]/10';

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-7rem)]">
      <div className="mb-4">
        <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Implant Planning</h1>
        <p className="text-[14px] text-[#5C5C5F] mt-3">Position and validate implant placement</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 h-[calc(100%-80px)]">
        {/* 3D Viewer */}
        <div className="lg:col-span-3 bg-[#0a0a1a] rounded-lg overflow-hidden relative">
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
          <div className={`absolute top-4 left-4 ${safetyBg} px-4 py-2 rounded-md`}>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${safetyStatus === 'safe' ? 'bg-[#30A46C]' : safetyStatus === 'warning' ? 'bg-[#E5A836]' : 'bg-[#E5484D]'}`} />
              <span className={`text-[13px] font-medium ${safetyColor}`}>
                {safetyStatus === 'safe' ? 'Safe Placement' : safetyStatus === 'warning' ? 'Caution — Close to Nerve' : 'Danger — Nerve Collision'}
              </span>
            </div>
          </div>

          <div className="absolute top-4 right-4 bg-[#0A0A0B]/90 backdrop-blur-sm rounded-md px-4 py-2 text-[11px] text-[#5C5C5F]">
            Drag to rotate &middot; Scroll to zoom
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-3 overflow-y-auto">
          {/* Implant selector */}
          <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-4 transition-all duration-300">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Implant Size</h3>
            <div className="space-y-2">
              {implantSizes.map((imp, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImplant(i)}
                  className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                    selectedImplant === i
                      ? 'bg-[#5B5BD6]/15 text-[#5B5BD6] font-medium'
                      : 'text-[#8B8B8E] hover:bg-white/[0.04]'
                  }`}
                >
                  {imp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Safety simulation */}
          <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-4 transition-all duration-300">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Safety Check</h3>
            <div className="space-y-2">
              {(['safe', 'warning', 'danger'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSafetyStatus(s)}
                  className={`w-full text-left px-3 py-2 rounded-md text-[13px] transition-colors ${
                    safetyStatus === s ? 'bg-white/[0.06] font-medium' : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    s === 'safe' ? 'bg-[#30A46C]' : s === 'warning' ? 'bg-[#E5A836]' : 'bg-[#E5484D]'
                  }`} />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Measurements */}
          <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-4 transition-all duration-300">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Measurements</h3>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-[#5C5C5F]">Bone Height</span>
                <span className="font-medium text-[#EDEDEF]">14.2 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5C5F]">Bone Width</span>
                <span className="font-medium text-[#EDEDEF]">8.5 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5C5F]">To IAN Canal</span>
                <span className="font-medium text-[#30A46C]">3.8 mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5C5C5F]">To Adjacent Tooth</span>
                <span className="font-medium text-[#EDEDEF]">2.1 mm</span>
              </div>
            </div>
          </div>

          {/* Action */}
          <button className="w-full py-3 bg-[#5B5BD6] text-white rounded-md text-[13px] font-medium hover:bg-[#6E6ADE] transition-colors">
            Generate Surgical Guide
          </button>
        </div>
      </div>
    </div>
  );
}
