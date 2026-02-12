'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import ConfidenceBar from '@/components/platform/ConfidenceBar';
import PathologyBadge from '@/components/platform/PathologyBadge';
import ViewerToolbar from '@/components/platform/ViewerToolbar';
import ImageUploadZone from '@/components/platform/ImageUploadZone';
import CanvasViewer from '@/components/platform/CanvasViewer';
import LoadingOverlay from '@/components/platform/LoadingOverlay';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { pathologies as mockPathologies } from '@/lib/mock-data/pathologies';
import { dentalChartData as mockChartData } from '@/lib/mock-data/dental-chart';
import { selectedPatient } from '@/lib/mock-data/patients';

type ViewTab = 'original' | 'overlay';

export default function ViewerPage() {
  const [activeTab, setActiveTab] = useState<ViewTab>('overlay');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const {
    uploadedImage,
    analysisResult,
    analysisLoading,
    isDemo,
    currentPatient,
    setCurrentPatient,
    viewerSettings,
    setViewerSettings,
    resetViewerSettings,
    setIsDemo,
    setAnalysisResult,
    setUploadedImage,
  } = usePlatformStore();

  // Use real data or mock data
  const pathologies = !isDemo && analysisResult ? analysisResult.pathologies : mockPathologies;
  const chartData = !isDemo && analysisResult?.dentalChart
    ? (analysisResult.dentalChart as Record<number, import('@/lib/mock-data/dental-chart').ToothData>)
    : mockChartData;
  const patient = isDemo ? selectedPatient : currentPatient;

  const selectedPathology = selectedTooth
    ? pathologies.find((p) => p.affectedTeeth.includes(selectedTooth))
    : null;

  const toothData = selectedTooth ? chartData[selectedTooth] : null;

  const hasImage = !!uploadedImage;

  // Toolbar items connected to real viewer settings
  const toolbarItems = [
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
      label: 'Zoom In',
      onClick: () => setViewerSettings({ zoom: Math.min(8, viewerSettings.zoom * 1.2) }),
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
      label: 'Zoom Out',
      onClick: () => setViewerSettings({ zoom: Math.max(0.2, viewerSettings.zoom * 0.8) }),
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
      label: `Brightness: ${viewerSettings.brightness}%`,
      onClick: () => setViewerSettings({ brightness: viewerSettings.brightness >= 150 ? 50 : viewerSettings.brightness + 25 }),
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 2a10 10 0 0 0 0 20" fill="currentColor" opacity="0.3" /></svg>,
      label: `Contrast: ${viewerSettings.contrast}%`,
      onClick: () => setViewerSettings({ contrast: viewerSettings.contrast >= 200 ? 50 : viewerSettings.contrast + 25 }),
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 3l18 18" /></svg>,
      label: 'Invert',
      active: viewerSettings.invert,
      onClick: () => setViewerSettings({ invert: !viewerSettings.invert }),
    },
    {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></svg>,
      label: 'Reset',
      onClick: resetViewerSettings,
    },
  ];

  const tabs: { key: ViewTab; label: string }[] = [
    { key: 'original', label: 'Original' },
    { key: 'overlay', label: 'AI Overlay' },
  ];

  // Toggle demo mode
  const handleToggleDemo = () => {
    if (isDemo) {
      setIsDemo(false);
    } else {
      setIsDemo(true);
      setAnalysisResult(null);
      setUploadedImage(null);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-7rem)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ViewerToolbar tools={toolbarItems} />
          {/* Brightness/Contrast sliders */}
          <div className="hidden xl:flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
              <input
                type="range"
                min="20"
                max="200"
                value={viewerSettings.brightness}
                onChange={(e) => setViewerSettings({ brightness: Number(e.target.value) })}
                className="w-24 accent-[#4A39C0]"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
              <input
                type="range"
                min="20"
                max="300"
                value={viewerSettings.contrast}
                onChange={(e) => setViewerSettings({ contrast: Number(e.target.value) })}
                className="w-24 accent-[#4A39C0]"
              />
            </label>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleDemo}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isDemo ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isDemo ? 'Demo Mode' : 'Live Mode'}
          </button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[calc(100%-60px)]">
        {/* Main viewer area */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {hasImage ? (
            <>
              {/* Canvas viewer */}
              <div className="relative flex-1 min-h-[400px]">
                <CanvasViewer
                  showMarkers={activeTab === 'overlay'}
                  onMarkerClick={(p) => setSelectedTooth(p.affectedTeeth[0])}
                />
                <LoadingOverlay visible={analysisLoading} />
                {/* Analysis badge */}
                {analysisResult && (
                  <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                    Analysed in {(analysisResult.analysisTimeMs / 1000).toFixed(1)}s
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                  {activeTab === 'original' ? 'Original View' : 'AI Analysis Active'}
                </div>
              </div>
            </>
          ) : isDemo ? (
            /* Demo view: mock panoramic */
            <div className="relative flex-1 bg-[#0a0a1a] rounded-2xl overflow-hidden border border-gray-800 min-h-[400px]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[90%] h-[80%]">
                  <svg viewBox="0 0 400 200" className="w-full h-full opacity-30">
                    <ellipse cx="200" cy="60" rx="180" ry="55" fill="none" stroke="#3a3a5a" strokeWidth="2" />
                    <ellipse cx="200" cy="140" rx="160" ry="50" fill="none" stroke="#3a3a5a" strokeWidth="2" />
                    {Array.from({ length: 14 }, (_, i) => {
                      const x = 45 + i * (310 / 13);
                      return <rect key={`u${i}`} x={x - 8} y={25} width={16} height={40} rx={4} fill="#1a1a3a" stroke="#2a2a4a" strokeWidth={1} />;
                    })}
                    {Array.from({ length: 14 }, (_, i) => {
                      const x = 50 + i * (300 / 13);
                      return <rect key={`l${i}`} x={x - 8} y={120} width={16} height={40} rx={4} fill="#1a1a3a" stroke="#2a2a4a" strokeWidth={1} />;
                    })}
                  </svg>
                  {/* Mock markers */}
                  {activeTab !== 'original' && [
                    { id: 'PAT001', x: 35, y: 65, tooth: 36 },
                    { id: 'PAT002', x: 58, y: 32, tooth: 16 },
                    { id: 'PAT004', x: 12, y: 62, tooth: 48 },
                    { id: 'PAT006', x: 25, y: 60, tooth: 46 },
                    { id: 'PAT009', x: 65, y: 35, tooth: 14 },
                    { id: 'PAT011', x: 45, y: 30, tooth: 24 },
                    { id: 'PAT003', x: 40, y: 72, tooth: 31 },
                    { id: 'PAT007', x: 50, y: 28, tooth: 21 },
                  ].map((marker) => {
                    const pathology = mockPathologies.find((p) => p.id === marker.id);
                    if (!pathology) return null;
                    const cat = pathology.category;
                    const color = cat === 'endodontic' ? '#FF3254' : cat === 'restorative' ? '#4A39C0' : cat === 'periodontal' ? '#F59E0B' : '#10B981';
                    return (
                      <motion.div
                        key={marker.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute cursor-pointer"
                        style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                        onClick={() => setSelectedTooth(marker.tooth)}
                      >
                        <div className="absolute inset-[-8px] rounded-full animate-ping opacity-30" style={{ backgroundColor: color }} />
                        <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg relative z-10" style={{ backgroundColor: color }} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                Demo data
              </div>
              <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-sm">
                {activeTab === 'original' ? 'Original View' : 'AI Analysis Active'}
              </div>
            </div>
          ) : (
            /* No image, no demo: upload zone */
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[400px] flex items-center justify-center">
              <div className="max-w-md w-full">
                <ImageUploadZone />
              </div>
            </div>
          )}

          {/* Dental chart below */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <DentalChart
              onToothClick={setSelectedTooth}
              selectedTooth={selectedTooth}
              highlightTeeth={pathologies.flatMap((p) => p.affectedTeeth)}
              chartData={chartData}
            />
          </div>
        </div>

        {/* Side panel */}
        <div className="lg:col-span-2 flex flex-col gap-5 overflow-y-auto">
          {/* Upload zone (when image exists, show compact upload) */}
          {!isDemo && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Upload Image</h3>
              <ImageUploadZone />
            </div>
          )}

          {/* Patient info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#4A39C0] flex items-center justify-center text-white text-sm font-bold">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                {isDemo ? (
                  <>
                    <div className="font-semibold text-[#1A1A2E]">{patient.name}</div>
                    <div className="text-xs text-gray-400">{patient.age}y &middot; {patient.gender} &middot; ID: {patient.id}</div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input
                      value={currentPatient.name}
                      onChange={(e) => setCurrentPatient({ name: e.target.value })}
                      className="text-sm font-semibold text-[#1A1A2E] bg-transparent border-b border-transparent focus:border-[#4A39C0] outline-none w-full"
                      placeholder="Patient name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={currentPatient.age}
                        onChange={(e) => setCurrentPatient({ age: Number(e.target.value) })}
                        className="text-xs text-gray-500 bg-transparent border-b border-transparent focus:border-[#4A39C0] outline-none w-12"
                      />
                      <span className="text-xs text-gray-400">y</span>
                      <select
                        value={currentPatient.gender}
                        onChange={(e) => setCurrentPatient({ gender: e.target.value as 'M' | 'F' })}
                        className="text-xs text-gray-500 bg-transparent outline-none"
                      >
                        <option value="M">M</option>
                        <option value="F">F</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-[#1A1A2E]">{isDemo ? '12' : (analysisResult ? 1 : 0)}</div>
                <div className="text-xs text-gray-400">Scans</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-[#FF3254]">{pathologies.length}</div>
                <div className="text-xs text-gray-400">Findings</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-500">
                  {pathologies.length > 0 ? Math.round(pathologies.reduce((s, p) => s + p.confidence, 0) / pathologies.length) : 0}%
                </div>
                <div className="text-xs text-gray-400">AI Conf.</div>
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
              <p className="text-xs text-gray-400 mt-0.5">
                {pathologies.length} conditions detected
                {!isDemo && analysisResult && (
                  <span className="ml-1">({new Date(analysisResult.analyzedAt).toLocaleString()})</span>
                )}
              </p>
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
