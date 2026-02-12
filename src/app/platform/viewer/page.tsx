'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import ConfidenceBar from '@/components/platform/ConfidenceBar';
import PathologyBadge from '@/components/platform/PathologyBadge';
import ViewerToolbar from '@/components/platform/ViewerToolbar';
import { selectedPatient } from '@/lib/mock-data/patients';
import { pathologies } from '@/lib/mock-data/pathologies';
import { dentalChartData } from '@/lib/mock-data/dental-chart';

type ViewTab = 'original' | 'overlay' | 'annotations';

// Marker positions (percentage-based on mock panoramic)
const markers = [
  { id: 'PAT001', x: 35, y: 65, tooth: 36 },
  { id: 'PAT002', x: 58, y: 32, tooth: 16 },
  { id: 'PAT004', x: 12, y: 62, tooth: 48 },
  { id: 'PAT006', x: 25, y: 60, tooth: 46 },
  { id: 'PAT009', x: 65, y: 35, tooth: 14 },
  { id: 'PAT011', x: 45, y: 30, tooth: 24 },
  { id: 'PAT003', x: 40, y: 72, tooth: 31 },
  { id: 'PAT007', x: 50, y: 28, tooth: 21 },
];

export default function ViewerPage() {
  const [activeTab, setActiveTab] = useState<ViewTab>('overlay');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  const selectedPathology = selectedTooth
    ? pathologies.find((p) => p.affectedTeeth.includes(selectedTooth))
    : null;

  const toothData = selectedTooth ? dentalChartData[selectedTooth] : null;

  const toolbarItems = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
      label: 'Zoom In',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
      label: 'Zoom Out',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>,
      label: 'Pan',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
      label: 'Brightness',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20" fill="currentColor" opacity="0.3" /></svg>,
      label: 'Contrast',
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
      label: 'Export',
    },
  ];

  const tabs: { key: ViewTab; label: string }[] = [
    { key: 'original', label: 'Original' },
    { key: 'overlay', label: 'AI Overlay' },
    { key: 'annotations', label: 'Annotations' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-7rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <ViewerToolbar tools={toolbarItems} />
        <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#4A39C0] text-white'
                  : 'text-gray-500 hover:text-[#1A1A2E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100%-60px)]">
        {/* Main viewer area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Panoramic image placeholder */}
          <div className="relative flex-1 bg-[#0a0a1a] rounded-2xl overflow-hidden border border-gray-800 min-h-[400px]">
            {/* Simulated panoramic X-ray background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[90%] h-[80%]">
                {/* Jaw outline simulation */}
                <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
                  <ellipse cx="200" cy="60" rx="180" ry="55" fill="none" stroke="#3a3a5a" strokeWidth="2" />
                  <ellipse cx="200" cy="140" rx="160" ry="50" fill="none" stroke="#3a3a5a" strokeWidth="2" />
                  {/* Tooth outlines - upper */}
                  {Array.from({ length: 14 }, (_, i) => {
                    const x = 45 + i * (310 / 13);
                    return <rect key={`u${i}`} x={x - 8} y={25} width={16} height={40} rx={4} fill="#1a1a3a" stroke="#2a2a4a" strokeWidth={1} />;
                  })}
                  {/* Tooth outlines - lower */}
                  {Array.from({ length: 14 }, (_, i) => {
                    const x = 50 + i * (300 / 13);
                    return <rect key={`l${i}`} x={x - 8} y={120} width={16} height={40} rx={4} fill="#1a1a3a" stroke="#2a2a4a" strokeWidth={1} />;
                  })}
                </svg>

                {/* AI overlay markers */}
                {activeTab !== 'original' && markers.map((marker) => {
                  const pathology = pathologies.find((p) => p.id === marker.id);
                  if (!pathology) return null;
                  const isActive = hoveredMarker === marker.id || selectedTooth === marker.tooth;
                  const cat = pathology.category;
                  const color = cat === 'endodontic' ? '#FF3254' : cat === 'restorative' ? '#4A39C0' : cat === 'periodontal' ? '#F59E0B' : '#10B981';

                  return (
                    <motion.div
                      key={marker.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute cursor-pointer"
                      style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                      onMouseEnter={() => setHoveredMarker(marker.id)}
                      onMouseLeave={() => setHoveredMarker(null)}
                      onClick={() => setSelectedTooth(marker.tooth)}
                    >
                      {/* Pulsing ring */}
                      <div
                        className="absolute inset-[-8px] rounded-full animate-ping opacity-30"
                        style={{ backgroundColor: color }}
                      />
                      {/* Inner dot */}
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-lg relative z-10"
                        style={{ backgroundColor: color }}
                      />
                      {/* Tooltip */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute left-1/2 -translate-x-1/2 -top-10 bg-white rounded-lg shadow-xl px-3 py-1.5 whitespace-nowrap z-20"
                          >
                            <span className="text-xs font-medium text-[#1A1A2E]">{pathology.name}</span>
                            <span className="text-[10px] text-gray-400 ml-1.5">#{marker.tooth}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Analysis badge */}
            <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
              Analysed in 10s
            </div>

            {/* View mode indicator */}
            <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
              {activeTab === 'original' ? 'Original View' : activeTab === 'overlay' ? 'AI Analysis Active' : 'Annotation Mode'}
            </div>
          </div>

          {/* Dental chart below */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <DentalChart
              onToothClick={setSelectedTooth}
              selectedTooth={selectedTooth}
              highlightTeeth={pathologies.flatMap((p) => p.affectedTeeth)}
            />
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
          {/* Patient info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#4A39C0] flex items-center justify-center text-white text-sm font-bold">
                {selectedPatient.avatar}
              </div>
              <div>
                <div className="font-semibold text-[#1A1A2E]">{selectedPatient.name}</div>
                <div className="text-xs text-gray-400">{selectedPatient.age}y &middot; {selectedPatient.gender} &middot; ID: {selectedPatient.id}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-[#1A1A2E]">{selectedPatient.scanCount}</div>
                <div className="text-[10px] text-gray-400">Scans</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-[#FF3254]">{selectedPatient.pathologyCount}</div>
                <div className="text-[10px] text-gray-400">Findings</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-500">98%</div>
                <div className="text-[10px] text-gray-400">AI Conf.</div>
              </div>
            </div>
          </div>

          {/* Selected tooth detail */}
          <AnimatePresence mode="wait">
            {selectedTooth && toothData && (
              <motion.div
                key={selectedTooth}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#1A1A2E]">Tooth #{selectedTooth}</h3>
                  <button onClick={() => setSelectedTooth(null)} className="text-gray-400 hover:text-gray-600 text-sm">
                    Clear
                  </button>
                </div>
                {toothData.findings.length > 0 ? (
                  <ul className="space-y-2">
                    {toothData.findings.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF3254] mt-1.5 shrink-0" />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400">No findings for this tooth</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Conditions list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex-1">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-[#1A1A2E]">AI Findings</h3>
              <p className="text-xs text-gray-400 mt-0.5">{pathologies.length} conditions detected</p>
            </div>
            <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
              {pathologies.map((p) => (
                <motion.div
                  key={p.id}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTooth && p.affectedTeeth.includes(selectedTooth)
                      ? 'border-[#4A39C0] bg-[#F9F8FF]'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setSelectedTooth(p.affectedTeeth[0])}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-[#1A1A2E]">{p.name}</span>
                    <PathologyBadge category={p.category} />
                  </div>
                  <div className="text-xs text-gray-400 mb-2">
                    Teeth: {p.affectedTeeth.map((t) => `#${t}`).join(', ')}
                  </div>
                  <ConfidenceBar value={p.confidence} label="Confidence" size="sm" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
