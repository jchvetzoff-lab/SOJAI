'use client';

import { useState, useMemo } from 'react';
import StatCard from '@/components/platform/StatCard';
import DentalChart from '@/components/platform/DentalChart';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { FDI_UPPER_RIGHT, FDI_UPPER_LEFT, FDI_LOWER_LEFT, FDI_LOWER_RIGHT } from '@/lib/dental-utils';

// Default mock data
const defaultPerioData: Record<number, number[]> = {
  18: [3, 2, 3, 2, 2, 3], 17: [3, 3, 3, 3, 2, 3], 16: [4, 3, 4, 3, 3, 4],
  15: [3, 2, 3, 2, 2, 3], 14: [3, 3, 3, 3, 3, 4], 13: [2, 2, 2, 2, 2, 2],
  12: [2, 2, 2, 2, 2, 2], 11: [3, 2, 3, 2, 2, 3],
  21: [4, 3, 4, 3, 3, 4], 22: [2, 2, 3, 2, 2, 2], 23: [2, 2, 2, 2, 2, 2],
  24: [3, 3, 4, 3, 3, 3], 25: [3, 2, 3, 2, 2, 3], 26: [5, 4, 5, 4, 4, 5],
  27: [3, 3, 3, 3, 3, 3], 28: [0, 0, 0, 0, 0, 0],
  38: [3, 3, 3, 3, 3, 3], 37: [4, 3, 4, 3, 3, 4], 36: [6, 5, 6, 5, 5, 6],
  35: [3, 2, 3, 2, 2, 3], 34: [2, 2, 3, 2, 2, 2], 33: [4, 3, 4, 3, 3, 4],
  32: [4, 3, 4, 3, 3, 3], 31: [5, 4, 5, 4, 4, 5],
  41: [5, 4, 4, 4, 3, 4], 42: [4, 3, 4, 3, 3, 4], 43: [4, 3, 3, 3, 3, 3],
  44: [3, 2, 3, 2, 2, 3], 45: [3, 3, 3, 3, 2, 3], 46: [6, 5, 7, 5, 5, 6],
  47: [3, 3, 3, 3, 3, 3], 48: [4, 3, 4, 3, 3, 3],
};

const defaultBoneLoss: Record<number, number> = {
  18: 1, 17: 2, 16: 3, 15: 1, 14: 2, 13: 1, 12: 1, 11: 2,
  21: 3, 22: 1, 23: 1, 24: 2, 25: 1, 26: 4, 27: 2, 28: 0,
  38: 2, 37: 3, 36: 5, 35: 1, 34: 1, 33: 3, 32: 3, 31: 4,
  41: 4, 42: 3, 43: 3, 44: 1, 45: 2, 46: 5, 47: 2, 48: 2,
};

function PocketChart({ teeth, label, perioData }: { teeth: number[]; label: string; perioData: Record<number, number[]> }) {
  return (
    <div>
      <div className="text-[11px] text-[#5C5C5F] mb-2">{label}</div>
      <div className="flex gap-[2px]">
        {teeth.map((tooth) => {
          const depths = perioData[tooth] || [0, 0, 0, 0, 0, 0];
          const maxDepth = Math.max(...depths);
          const color = maxDepth >= 6 ? '#E5484D' : maxDepth >= 5 ? '#E5A836' : maxDepth >= 4 ? '#E5A836' : '#30A46C';
          return (
            <div key={tooth} className="flex flex-col items-center">
              <div className="flex gap-[1px] mb-1">
                {depths.slice(0, 3).map((d, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-t-sm"
                    style={{
                      height: `${Math.max(d * 4, 4)}px`,
                      backgroundColor: d >= 6 ? '#E5484D' : d >= 5 ? '#E5A836' : d >= 4 ? '#E5A836' : '#30A46C',
                      opacity: d === 0 ? 0.1 : 1,
                    }}
                  />
                ))}
              </div>
              <div
                className="w-7 h-7 rounded text-[10px] font-bold flex items-center justify-center text-white"
                style={{ backgroundColor: color, opacity: depths[0] === 0 ? 0.2 : 1 }}
              >
                {tooth}
              </div>
              <div className="flex gap-[1px] mt-1">
                {depths.slice(3).map((d, i) => (
                  <div
                    key={i}
                    className="w-2 rounded-b-sm"
                    style={{
                      height: `${Math.max(d * 4, 4)}px`,
                      backgroundColor: d >= 6 ? '#E5484D' : d >= 5 ? '#E5A836' : d >= 4 ? '#E5A836' : '#30A46C',
                      opacity: d === 0 ? 0.1 : 1,
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PeriodontalPage() {
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [manualEdits, setManualEdits] = useState<Record<number, { depths: number[]; boneLoss: number }>>({});

  const { analysisResult, isDemo } = usePlatformStore();

  // Merge analysis data with manual edits
  const perioData = useMemo(() => {
    let base: Record<number, number[]> = { ...defaultPerioData };
    if (!isDemo && analysisResult?.periodontalData) {
      base = {};
      for (const [key, val] of Object.entries(analysisResult.periodontalData)) {
        base[Number(key)] = val.pocketDepths;
      }
    }
    // Apply manual edits
    for (const [key, val] of Object.entries(manualEdits)) {
      base[Number(key)] = val.depths;
    }
    return base;
  }, [isDemo, analysisResult, manualEdits]);

  const boneLossData = useMemo(() => {
    let base: Record<number, number> = { ...defaultBoneLoss };
    if (!isDemo && analysisResult?.periodontalData) {
      base = {};
      for (const [key, val] of Object.entries(analysisResult.periodontalData)) {
        base[Number(key)] = val.boneLoss;
      }
    }
    for (const [key, val] of Object.entries(manualEdits)) {
      base[Number(key)] = val.boneLoss;
    }
    return base;
  }, [isDemo, analysisResult, manualEdits]);

  // Stats
  const allDepths = Object.values(perioData).flat().filter((d) => d > 0);
  const avgDepth = allDepths.length > 0 ? (allDepths.reduce((a, b) => a + b, 0) / allDepths.length).toFixed(1) : '0';
  const sitesOver5 = allDepths.filter((d) => d >= 5).length;
  const teethAtRisk = Object.entries(perioData).filter(([, depths]) => depths.some((d) => d >= 5)).length;
  const boneLossValues = Object.values(boneLossData).filter((v) => v > 0);
  const avgBoneLoss = boneLossValues.length > 0 ? (boneLossValues.reduce((a, b) => a + b, 0) / boneLossValues.length).toFixed(1) : '0';

  const handleEditDepth = (tooth: number, index: number, value: number) => {
    const current = manualEdits[tooth] || {
      depths: perioData[tooth] || [0, 0, 0, 0, 0, 0],
      boneLoss: boneLossData[tooth] || 0,
    };
    const newDepths = [...current.depths];
    newDepths[index] = value;
    setManualEdits({ ...manualEdits, [tooth]: { ...current, depths: newDepths } });
  };

  const handleEditBoneLoss = (tooth: number, value: number) => {
    const current = manualEdits[tooth] || {
      depths: perioData[tooth] || [0, 0, 0, 0, 0, 0],
      boneLoss: boneLossData[tooth] || 0,
    };
    setManualEdits({ ...manualEdits, [tooth]: { ...current, boneLoss: value } });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Periodontal Analysis</h1>
        <p className="text-[14px] text-[#5C5C5F] mt-3">
          Pocket depth charting and bone loss assessment
          {isDemo && <span className="ml-1 text-[#E5A836]">(demo data)</span>}
          {!isDemo && analysisResult && <span className="ml-1 text-[#30A46C]">(from AI analysis — click tooth to edit)</span>}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Avg. Pocket Depth"
          value={`${avgDepth}mm`}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="20" x2="12" y2="4" /><polyline points="6 10 12 4 18 10" /></svg>}
        />
        <StatCard
          title="Sites > 5mm"
          value={sitesOver5}
          changeType="negative"
          change="Needs attention"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /></svg>}
        />
        <StatCard
          title="Teeth at Risk"
          value={teethAtRisk}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
        />
        <StatCard
          title="Avg. Bone Loss"
          value={`${avgBoneLoss}mm`}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>}
        />
      </div>

      {/* Pocket depth chart */}
      <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-5 transition-all duration-300 overflow-x-auto">
        <h3 className="font-semibold text-[#EDEDEF] mb-4">Pocket Depth Chart (6 sites per tooth)</h3>
        <div className="space-y-3 min-w-[600px]">
          <div className="flex gap-3 justify-center">
            <PocketChart teeth={FDI_UPPER_RIGHT} label="Q1 (Upper Right)" perioData={perioData} />
            <PocketChart teeth={FDI_UPPER_LEFT} label="Q2 (Upper Left)" perioData={perioData} />
          </div>
          <div className="border-t border-white/[0.06]" />
          <div className="flex gap-3 justify-center">
            <PocketChart teeth={[...FDI_LOWER_RIGHT].reverse()} label="Q4 (Lower Right)" perioData={perioData} />
            <PocketChart teeth={[...FDI_LOWER_LEFT].reverse()} label="Q3 (Lower Left)" perioData={perioData} />
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 justify-center">
          {[
            { color: '#30A46C', label: '1-3mm (Healthy)' },
            { color: '#E5A836', label: '4mm (Moderate)' },
            { color: '#E5A836', label: '5mm (Deep)' },
            { color: '#E5484D', label: '6mm+ (Critical)' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
              <span className="text-[11px] text-[#5C5C5F]">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bone loss + Dental chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-5 transition-all duration-300">
          <h3 className="font-semibold text-[#EDEDEF] mb-4">Bone Loss Assessment</h3>
          <div className="space-y-2">
            {Object.entries(boneLossData)
              .filter(([, v]) => v >= 3)
              .sort(([, a], [, b]) => b - a)
              .map(([tooth, loss]) => (
                <div key={tooth} className="flex items-center gap-3">
                  <span className="text-[13px] font-medium text-[#EDEDEF] w-12">#{tooth}</span>
                  <div className="flex-1 bg-white/[0.06] rounded-full h-2">
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${(loss / 7) * 100}%`,
                        backgroundColor: loss >= 5 ? '#E5484D' : loss >= 4 ? '#E5A836' : '#E5A836',
                      }}
                    />
                  </div>
                  <span className="text-[13px] font-medium w-12 text-right" style={{
                    color: loss >= 5 ? '#E5484D' : loss >= 4 ? '#E5A836' : '#E5A836',
                  }}>
                    {loss}mm
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-5 transition-all duration-300">
          <h3 className="font-semibold text-[#EDEDEF] mb-4">Dental Chart</h3>
          <DentalChart
            onToothClick={setSelectedTooth}
            selectedTooth={selectedTooth}
            highlightTeeth={Object.entries(boneLossData).filter(([, v]) => v >= 4).map(([t]) => Number(t))}
          />
          {selectedTooth && perioData[selectedTooth] && (
            <div className="mt-4 p-3 bg-white/[0.04] rounded-md">
              <div className="text-[13px] font-medium text-[#EDEDEF] mb-2">
                Tooth #{selectedTooth}
                <span className="text-[11px] text-[#5C5C5F] ml-2">(click values to edit)</span>
              </div>
              <div className="grid grid-cols-6 gap-1 text-center text-[11px]">
                {['MB', 'B', 'DB', 'ML', 'L', 'DL'].map((site, i) => {
                  const depth = perioData[selectedTooth][i];
                  return (
                    <div key={site}>
                      <div className="text-[#5C5C5F]">{site}</div>
                      <input
                        type="number"
                        min={0}
                        max={15}
                        value={depth}
                        onChange={(e) => handleEditDepth(selectedTooth, i, Number(e.target.value))}
                        className={`w-full text-center font-bold bg-transparent outline-none border-b border-transparent focus:border-[#5B5BD6] ${
                          depth >= 5 ? 'text-[#E5484D]' : depth >= 4 ? 'text-[#E5A836]' : 'text-[#30A46C]'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="text-[11px] text-[#5C5C5F] mt-2 flex items-center gap-2">
                Bone loss:
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={boneLossData[selectedTooth] || 0}
                  onChange={(e) => handleEditBoneLoss(selectedTooth, Number(e.target.value))}
                  className="w-12 text-center font-medium bg-transparent outline-none border-b border-transparent focus:border-[#5B5BD6] text-[#EDEDEF]"
                />
                mm
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
