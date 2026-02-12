'use client';

import { useState } from 'react';
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

export default function DetectionPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([]);
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
          <h1 className="text-4xl tracking-tight font-bold text-[#1A1A2E]">AI Detection Results</h1>
          <p className="text-lg text-gray-400 mt-3">No analysis available</p>
        </div>
        <EmptyState
          title="No analysis yet"
          description="Upload a dental scan in the Viewer to get AI-powered pathology detection."
        />
      </div>
    );
  }

  const filtered = pathologies.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;
    if (selectedSeverities.length > 0 && !selectedSeverities.includes(p.severity)) return false;
    if (selectedTooth && !p.affectedTeeth.includes(selectedTooth)) return false;
    return true;
  });

  const criticalFindings = pathologies.filter((p) => p.severity === 'critical');

  const categoryOptions = Object.entries(PATHOLOGY_CATEGORIES).map(([key, val]) => ({
    key,
    label: val.label,
    color: val.color,
    count: pathologies.filter((p) => p.category === key).length,
  }));

  const severityOptions = Object.entries(SEVERITY_LEVELS).map(([key, val]) => ({
    key,
    label: val.label,
    color: val.color,
    count: pathologies.filter((p) => p.severity === key).length,
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl tracking-tight font-bold text-[#1A1A2E]">AI Detection Results</h1>
        <p className="text-lg text-gray-400 mt-3">
          {pathologies.length} pathologies detected across {new Set(pathologies.flatMap((p) => p.affectedTeeth)).size} teeth
          {isDemo && <span className="ml-1 text-amber-500">(demo data)</span>}
          {!isDemo && analysisResult && (
            <span className="ml-1 text-emerald-500">
              &mdash; Analyzed {new Date(analysisResult.analyzedAt).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>

      {/* Critical alerts */}
      {criticalFindings.length > 0 && (
        <div className="bg-red-50 border border-red-200/60 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="text-sm font-semibold text-red-700">Critical Findings Require Attention</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {criticalFindings.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedTooth(f.affectedTeeth[0])}
                className="bg-white border border-red-200 rounded-2xl px-5 py-2 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
              >
                {f.name} — Tooth {f.affectedTeeth.map((t) => `#${t}`).join(', ')}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Category</h3>
            <CategoryFilter
              options={categoryOptions}
              selected={selectedCategories}
              onChange={setSelectedCategories}
            />
          </div>
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Severity</h3>
            <CategoryFilter
              options={severityOptions}
              selected={selectedSeverities}
              onChange={setSelectedSeverities}
            />
          </div>
          {(selectedCategories.length > 0 || selectedSeverities.length > 0 || selectedTooth) && (
            <button
              onClick={() => {
                setSelectedCategories([]);
                setSelectedSeverities([]);
                setSelectedTooth(null);
              }}
              className="text-sm text-[#4A39C0] hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{filtered.length} results</span>
          </div>

          <div className="space-y-4">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white rounded-3xl border p-7 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300 cursor-pointer ${
                  selectedTooth && p.affectedTeeth.includes(selectedTooth)
                    ? 'border-[#4A39C0] ring-1 ring-[#4A39C0]/20'
                    : 'border-black/[0.06] hover:border-gray-200'
                }`}
                onClick={() => setSelectedTooth(p.affectedTeeth[0])}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1A1A2E]">{p.name}</span>
                      <PathologyBadge category={p.category} />
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: SEVERITY_LEVELS[p.severity].bg,
                          color: SEVERITY_LEVELS[p.severity].color,
                        }}
                      >
                        {SEVERITY_LEVELS[p.severity].label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex-1 max-w-[200px]">
                    <ConfidenceBar value={p.confidence} label="Confidence" size="sm" />
                  </div>
                  <div className="text-xs text-gray-400">
                    Affected: {p.affectedTeeth.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center justify-center w-8 h-7 bg-gray-100 rounded text-xs text-[#1A1A2E] font-medium mx-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Dental chart at bottom */}
          <div className="bg-white rounded-3xl border border-black/[0.06] p-6 shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Affected Teeth Overview</h3>
            <DentalChart
              onToothClick={setSelectedTooth}
              selectedTooth={selectedTooth}
              highlightTeeth={filtered.flatMap((p) => p.affectedTeeth)}
              chartData={chartData}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
