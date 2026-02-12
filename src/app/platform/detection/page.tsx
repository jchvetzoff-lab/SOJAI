'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import PathologyBadge from '@/components/platform/PathologyBadge';
import ConfidenceBar from '@/components/platform/ConfidenceBar';
import CategoryFilter from '@/components/platform/CategoryFilter';
import EmptyState from '@/components/platform/EmptyState';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { pathologies as mockPathologies } from '@/lib/mock-data/pathologies';
import { dentalChartData as mockChartData } from '@/lib/mock-data/dental-chart';
import { PATHOLOGY_CATEGORIES, SEVERITY_LEVELS } from '@/lib/platform-constants';
import { getToothName } from '@/lib/dental-utils';

export default function DetectionPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);

  const { analysisResult, isDemo } = usePlatformStore();

  const pathologies = !isDemo && analysisResult ? analysisResult.pathologies : mockPathologies;
  const chartData = !isDemo && analysisResult?.dentalChart
    ? (analysisResult.dentalChart as Record<number, import('@/lib/mock-data/dental-chart').ToothData>)
    : mockChartData;

  // If not demo and no analysis, show empty state
  if (!isDemo && !analysisResult) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl tracking-tight font-bold text-[#E2E8F0]">CBCT AI Report</h1>
          <p className="text-lg text-[#64748B] mt-3">No analysis available</p>
        </div>
        <EmptyState
          title="No analysis yet"
          description="Upload a dental scan in the Viewer to get AI-powered pathology detection."
        />
      </div>
    );
  }

  // Filter pathologies by selected categories
  const filtered = pathologies.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (selectedTooth && !p.affectedTeeth.includes(selectedTooth)) return false;
    return true;
  });

  // Group pathologies by tooth
  const findingsByTooth = useMemo(() => {
    const map = new Map<number, typeof filtered>();
    filtered.forEach((p) => {
      p.affectedTeeth.forEach((t) => {
        if (!map.has(t)) map.set(t, []);
        map.get(t)!.push(p);
      });
    });
    // Sort by tooth number
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [filtered]);

  const categoryOptions = Object.entries(PATHOLOGY_CATEGORIES).map(([key, val]) => ({
    key,
    label: val.label,
    color: val.color,
    solidBg: val.solidBg,
    bg: val.bg,
    count: pathologies.filter((p) => p.category === key).length,
  }));

  const teethInReport = new Set(pathologies.flatMap((p) => p.affectedTeeth));

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl tracking-tight font-bold text-[#E2E8F0]">CBCT AI Report</h1>
          <p className="text-sm text-[#64748B] mt-1">
            {pathologies.length} findings across {teethInReport.size} teeth
            {isDemo && <span className="ml-1 text-amber-500">(demo data)</span>}
            {!isDemo && analysisResult && (
              <span className="ml-1 text-emerald-500">
                &mdash; Analyzed {new Date(analysisResult.analyzedAt).toLocaleDateString()}
              </span>
            )}
          </p>
        </div>
        <button className="px-5 py-2.5 bg-emerald-500 text-white rounded-full text-sm font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Approve all and sign
        </button>
      </div>

      {/* Category pills */}
      <div className="flex items-center gap-3 flex-wrap">
        <CategoryFilter
          options={categoryOptions}
          selected={selectedCategories}
          onChange={setSelectedCategories}
        />
        {(selectedCategories.length > 0 || selectedTooth) && (
          <button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedTooth(null);
            }}
            className="text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ minHeight: 'calc(100vh - 16rem)' }}>
        {/* LEFT: Panoramic + Dental Chart */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Mock panoramic X-ray */}
          <div className="relative bg-[#0a0a1a] rounded-2xl overflow-hidden border border-gray-800 min-h-[320px] flex-1">
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
                {/* Pathology markers */}
                {[
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
            <div className="absolute top-4 left-4 bg-white/10 text-white/70 px-3 py-1.5 rounded-2xl text-xs font-medium backdrop-blur-sm">
              Panoramic View
            </div>
          </div>

          {/* Dental chart */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#E2E8F0]">Teeth in the report</h3>
              <span className="text-xs text-[#64748B]">{teethInReport.size} teeth affected</span>
            </div>
            <DentalChart
              onToothClick={setSelectedTooth}
              selectedTooth={selectedTooth}
              highlightTeeth={filtered.flatMap((p) => p.affectedTeeth)}
              chartData={chartData}
            />
          </div>
        </div>

        {/* RIGHT: Findings by tooth (scrollable) */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] flex-1 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-white/[0.06]">
              <h3 className="font-semibold text-[#E2E8F0]">Findings by Tooth</h3>
              <p className="text-xs text-[#64748B] mt-0.5">{filtered.length} conditions found</p>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {findingsByTooth.map(([toothNum, findings], idx) => (
                <motion.div
                  key={toothNum}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    selectedTooth === toothNum
                      ? 'border-[#3B82F6] bg-[#3B82F6]/10'
                      : 'border-white/[0.06] hover:border-white/[0.1]'
                  }`}
                  onClick={() => setSelectedTooth(toothNum)}
                >
                  {/* Tooth header */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#1A1A2E] text-white text-sm font-bold">
                      {toothNum}
                    </span>
                    <div className="flex-1">
                      <span className="text-sm font-semibold text-[#E2E8F0]">Tooth {toothNum}</span>
                      <span className="text-xs text-[#64748B] ml-2">{getToothName(toothNum)}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Reviewed
                    </span>
                  </div>

                  {/* Condition tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {findings.map((f) => (
                      <PathologyBadge key={f.id} category={f.category} variant="solid" size="sm" />
                    ))}
                  </div>

                  {/* Finding details */}
                  <div className="space-y-2">
                    {findings.map((f) => (
                      <div key={f.id} className="flex items-start gap-2">
                        <span
                          className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                          style={{ backgroundColor: PATHOLOGY_CATEGORIES[f.category].solidBg }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#E2E8F0]">{f.name}</span>
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: SEVERITY_LEVELS[f.severity].bg,
                                color: SEVERITY_LEVELS[f.severity].color,
                              }}
                            >
                              {SEVERITY_LEVELS[f.severity].label}
                            </span>
                          </div>
                          <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{f.description}</p>
                          <div className="mt-1.5 max-w-[160px]">
                            <ConfidenceBar value={f.confidence} label="Confidence" size="sm" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}

              {findingsByTooth.length === 0 && (
                <div className="text-center py-12 text-[#64748B] text-sm">
                  No findings match the selected filters
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
