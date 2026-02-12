'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import ConfidenceBar from '@/components/platform/ConfidenceBar';
import PathologyBadge from '@/components/platform/PathologyBadge';
import CategoryFilter from '@/components/platform/CategoryFilter';
import ViewerToolbar from '@/components/platform/ViewerToolbar';
import ImageUploadZone from '@/components/platform/ImageUploadZone';
import CanvasViewer from '@/components/platform/CanvasViewer';
import LoadingOverlay from '@/components/platform/LoadingOverlay';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { pathologies as mockPathologies } from '@/lib/mock-data/pathologies';
import { dentalChartData as mockChartData } from '@/lib/mock-data/dental-chart';
import { selectedPatient } from '@/lib/mock-data/patients';
import { PATHOLOGY_CATEGORIES, SEVERITY_LEVELS } from '@/lib/platform-constants';
import { getToothName } from '@/lib/dental-utils';

type ViewTab = 'original' | 'overlay';

export default function ViewerPage() {
  const [activeTab, setActiveTab] = useState<ViewTab>('overlay');
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  // Filter pathologies
  const filteredPathologies = pathologies.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    return true;
  });

  // Group findings by tooth
  const findingsByTooth = useMemo(() => {
    const map = new Map<number, typeof filteredPathologies>();
    filteredPathologies.forEach((p) => {
      p.affectedTeeth.forEach((t) => {
        if (!map.has(t)) map.set(t, []);
        map.get(t)!.push(p);
      });
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filteredPathologies]);

  const categoryOptions = Object.entries(PATHOLOGY_CATEGORIES).map(([key, val]) => ({
    key,
    label: val.label,
    color: val.color,
    solidBg: val.solidBg,
    bg: val.bg,
    count: pathologies.filter((p) => p.category === key).length,
  }));

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
      {/* Page title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl tracking-tight font-bold text-[#E2E8F0]">2D Viewer</h1>
          <p className="text-sm text-[#64748B] mt-1">
            View, annotate and analyze dental scans with AI
            {isDemo && <span className="ml-1 text-amber-500">(demo data)</span>}
            {!isDemo && analysisResult && <span className="ml-1 text-emerald-500">(analysis loaded)</span>}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleDemo}
            className={`px-3 py-1.5 rounded-2xl text-sm font-medium transition-colors ${
              isDemo ? 'bg-amber-500/15 text-amber-400' : 'bg-white/[0.06] text-[#94A3B8]'
            }`}
          >
            {isDemo ? 'Demo Mode' : 'Live Mode'}
          </button>
          <div className="flex items-center bg-[#111C32] rounded-2xl border border-white/[0.06] p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-[#64748B] hover:text-[#E2E8F0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter bar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <CategoryFilter
          options={categoryOptions}
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
        {selectedCategories.length > 0 && (
          <button
            onClick={() => setSelectedCategories([])}
            className="text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <ViewerToolbar tools={toolbarItems} />
          {/* Brightness/Contrast sliders */}
          <div className="hidden xl:flex items-center gap-3 bg-[#111C32] rounded-xl border border-white/[0.06] p-2">
            <label className="flex items-center gap-2 text-xs text-[#64748B]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" /></svg>
              <input
                type="range"
                min="20"
                max="200"
                value={viewerSettings.brightness}
                onChange={(e) => setViewerSettings({ brightness: Number(e.target.value) })}
                className="w-24 accent-[#3B82F6]"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-[#64748B]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
              <input
                type="range"
                min="20"
                max="300"
                value={viewerSettings.contrast}
                onChange={(e) => setViewerSettings({ contrast: Number(e.target.value) })}
                className="w-24 accent-[#3B82F6]"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100%-180px)]">
        {/* Main viewer area */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {hasImage ? (
            <>
              {/* Canvas viewer */}
              <div className="relative flex-1 min-h-[400px]">
                <CanvasViewer
                  showMarkers={activeTab === 'overlay'}
                  onMarkerClick={(p) => setSelectedTooth(p.affectedTeeth[0])}
                />
                <LoadingOverlay visible={analysisLoading} />
                {analysisResult && (
                  <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-2xl text-xs font-medium backdrop-blur-sm">
                    Analysed in {(analysisResult.analysisTimeMs / 1000).toFixed(1)}s
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1.5 rounded-2xl text-xs font-medium backdrop-blur-sm">
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
                  {/* Mock markers — filtered by category */}
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
                    if (selectedCategories.length > 0 && !selectedCategories.includes(pathology.category)) return null;
                    const cat = PATHOLOGY_CATEGORIES[pathology.category];
                    return (
                      <motion.div
                        key={marker.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute cursor-pointer"
                        style={{ left: `${marker.x}%`, top: `${marker.y}%`, transform: 'translate(-50%, -50%)' }}
                        onClick={() => setSelectedTooth(marker.tooth)}
                      >
                        <div className="absolute inset-[-8px] rounded-full animate-ping opacity-30" style={{ backgroundColor: cat.solidBg }} />
                        <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg relative z-10" style={{ backgroundColor: cat.solidBg }} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-2xl text-xs font-medium backdrop-blur-sm">
                Demo data
              </div>
              <div className="absolute top-4 right-4 bg-white/10 text-white/70 px-3 py-1.5 rounded-2xl text-xs font-medium backdrop-blur-sm">
                {activeTab === 'original' ? 'Original View' : 'AI Analysis Active'}
              </div>
            </div>
          ) : (
            /* No image, no demo: upload zone */
            <div className="flex-1 bg-[#111C32] rounded-2xl border border-white/[0.06] p-8 min-h-[400px] flex items-center justify-center">
              <div className="max-w-md w-full">
                <ImageUploadZone />
              </div>
            </div>
          )}

          {/* Dental chart below */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-5">
            <DentalChart
              onToothClick={setSelectedTooth}
              selectedTooth={selectedTooth}
              highlightTeeth={filteredPathologies.flatMap((p) => p.affectedTeeth)}
              chartData={chartData}
            />
          </div>
        </div>

        {/* Side panel — findings grouped by tooth */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto">
          {/* Upload zone (when image exists, show compact upload) */}
          {!isDemo && (
            <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6">
              <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">Upload Image</h3>
              <ImageUploadZone />
            </div>
          )}

          {/* Patient info */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#3B82F6] flex items-center justify-center text-white text-sm font-bold">
                {patient.name.charAt(0)}
              </div>
              <div className="flex-1">
                {isDemo ? (
                  <>
                    <div className="font-semibold text-[#E2E8F0]">{patient.name}</div>
                    <div className="text-xs text-[#64748B]">{patient.age}y &middot; {patient.gender} &middot; ID: {patient.id}</div>
                  </>
                ) : (
                  <div className="space-y-1">
                    <input
                      value={currentPatient.name}
                      onChange={(e) => setCurrentPatient({ name: e.target.value })}
                      className="text-sm font-semibold text-[#E2E8F0] bg-transparent border-b border-transparent focus:border-[#3B82F6] outline-none w-full"
                      placeholder="Patient name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={currentPatient.age}
                        onChange={(e) => setCurrentPatient({ age: Number(e.target.value) })}
                        className="text-xs text-[#64748B] bg-transparent border-b border-transparent focus:border-[#3B82F6] outline-none w-12"
                      />
                      <span className="text-xs text-[#64748B]">y</span>
                      <select
                        value={currentPatient.gender}
                        onChange={(e) => setCurrentPatient({ gender: e.target.value as 'M' | 'F' })}
                        className="text-xs text-[#64748B] bg-transparent outline-none"
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
              <div className="bg-white/[0.04] rounded-lg p-2">
                <div className="text-lg font-bold text-[#E2E8F0]">{isDemo ? '12' : (analysisResult ? 1 : 0)}</div>
                <div className="text-xs text-[#64748B]">Scans</div>
              </div>
              <div className="bg-white/[0.04] rounded-lg p-2">
                <div className="text-lg font-bold text-[#EF4444]">{pathologies.length}</div>
                <div className="text-xs text-[#64748B]">Findings</div>
              </div>
              <div className="bg-white/[0.04] rounded-lg p-2">
                <div className="text-lg font-bold text-emerald-500">
                  {pathologies.length > 0 ? Math.round(pathologies.reduce((s, p) => s + p.confidence, 0) / pathologies.length) : 0}%
                </div>
                <div className="text-xs text-[#64748B]">AI Conf.</div>
              </div>
            </div>
          </div>

          {/* Findings by tooth */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] flex-1 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <h3 className="font-semibold text-[#E2E8F0]">AI Findings</h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                {filteredPathologies.length} conditions detected
                {!isDemo && analysisResult && (
                  <span className="ml-1">({new Date(analysisResult.analyzedAt).toLocaleString()})</span>
                )}
              </p>
            </div>
            <div className="p-3 space-y-3 max-h-[400px] overflow-y-auto">
              {findingsByTooth.map(([toothNum, findings]) => (
                <div
                  key={toothNum}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    selectedTooth === toothNum
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                      : 'border-white/[0.06] hover:border-white/[0.08]'
                  }`}
                  onClick={() => setSelectedTooth(toothNum)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-[#1A1A2E] text-white text-xs font-bold">
                      {toothNum}
                    </span>
                    <span className="text-sm font-medium text-[#E2E8F0]">Tooth {toothNum}</span>
                    <span className="text-xs text-[#64748B]">{getToothName(toothNum)}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {findings.map((f) => (
                      <PathologyBadge key={f.id} category={f.category} variant="solid" size="sm" />
                    ))}
                  </div>
                  {findings.map((f) => (
                    <div key={f.id} className="mb-1.5 last:mb-0">
                      <div className="text-xs text-[#64748B]">{f.name} — {f.confidence}%</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
