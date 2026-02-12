'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import ReportSection from '@/components/platform/ReportSection';
import PathologyBadge from '@/components/platform/PathologyBadge';
import { selectedPatient } from '@/lib/mock-data/patients';
import { pathologies } from '@/lib/mock-data/pathologies';
import { reportSections as defaultSections } from '@/lib/mock-data/reports';
import { SEVERITY_LEVELS } from '@/lib/platform-constants';

export default function ReportPage() {
  const [sections, setSections] = useState(defaultSections);
  const [language, setLanguage] = useState('en');
  const [branding, setBranding] = useState(true);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const enabledSections = sections.filter((s) => s.enabled);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Report Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Create professional diagnostic reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          {/* Branding */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clinic Branding</span>
                <button
                  onClick={() => setBranding(!branding)}
                  className={`w-10 h-5 rounded-full transition-colors ${branding ? 'bg-[#4A39C0]' : 'bg-gray-300'}`}
                >
                  <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${branding ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </label>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 outline-none focus:border-[#4A39C0]"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Español</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section toggles */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Report Sections</h3>
            <div className="space-y-2">
              {sections.map((s) => (
                <label key={s.id} className="flex items-center justify-between py-1 cursor-pointer">
                  <span className={`text-sm ${s.enabled ? 'text-[#1A1A2E]' : 'text-gray-400'}`}>{s.title}</span>
                  <button
                    onClick={() => toggleSection(s.id)}
                    className={`w-8 h-4 rounded-full transition-colors ${s.enabled ? 'bg-[#4A39C0]' : 'bg-gray-200'}`}
                  >
                    <span className={`block w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5 ${s.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button className="w-full py-3 bg-[#4A39C0] text-white rounded-xl text-sm font-medium hover:bg-[#3a2da0] transition-colors">
              Download PDF
            </button>
            <button className="w-full py-3 bg-white text-[#4A39C0] border border-[#4A39C0] rounded-xl text-sm font-medium hover:bg-[#F9F8FF] transition-colors">
              Print Preview
            </button>
          </div>
        </div>

        {/* A4 Preview */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[800px]"
            style={{ aspectRatio: '210 / 297', maxWidth: '595px', margin: '0 auto' }}
          >
            {/* Report header */}
            {enabledSections.some((s) => s.id === 'header') && (
              <ReportSection title="">
                <div className="flex items-center justify-between pb-4 border-b-2 border-[#4A39C0] mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#4A39C0] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                      </div>
                      <span className="text-lg font-bold text-[#1A1A2E]">SOJAI Diagnostics</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">AI-Powered Dental Analysis Report</p>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <p>Report #{selectedPatient.id}-RPT001</p>
                    <p>Generated: Feb 12, 2026</p>
                  </div>
                </div>
              </ReportSection>
            )}

            {/* Patient info */}
            {enabledSections.some((s) => s.id === 'patient') && (
              <ReportSection title="Patient Information">
                <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-medium text-[#1A1A2E]">{selectedPatient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-[#1A1A2E]">{selectedPatient.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium text-[#1A1A2E]">{selectedPatient.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium text-[#1A1A2E]">{selectedPatient.gender === 'M' ? 'Male' : 'Female'}</span>
                  </div>
                </div>
              </ReportSection>
            )}

            {/* Dental chart */}
            {enabledSections.some((s) => s.id === 'dental_chart') && (
              <ReportSection title="Dental Chart">
                <DentalChart
                  compact
                  highlightTeeth={pathologies.flatMap((p) => p.affectedTeeth)}
                />
              </ReportSection>
            )}

            {/* Findings */}
            {enabledSections.some((s) => s.id === 'findings') && (
              <ReportSection title="AI Findings">
                <div className="space-y-2">
                  {pathologies.slice(0, 6).map((p) => (
                    <div key={p.id} className="flex items-start gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full mt-1 shrink-0"
                        style={{ backgroundColor: SEVERITY_LEVELS[p.severity].color }}
                      />
                      <div className="flex-1">
                        <span className="font-medium text-[#1A1A2E]">{p.name}</span>
                        <span className="text-gray-400 ml-1">(Teeth: {p.affectedTeeth.join(', ')})</span>
                        <span className="text-gray-400 ml-1">— {p.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                  {pathologies.length > 6 && (
                    <p className="text-[10px] text-gray-400 italic">+ {pathologies.length - 6} more findings</p>
                  )}
                </div>
              </ReportSection>
            )}

            {/* Recommendations */}
            {enabledSections.some((s) => s.id === 'recommendations') && (
              <ReportSection title="Recommendations">
                <ol className="list-decimal list-inside space-y-1 text-xs text-gray-600">
                  <li>Urgent evaluation of periapical lesion on tooth #36 — consider endodontic retreatment</li>
                  <li>Monitor suspected vertical root fracture on tooth #14 — CBCT recommended</li>
                  <li>Restore proximal caries on teeth #15–16 before further progression</li>
                  <li>Periodontal assessment for generalized bone loss in mandibular anterior region</li>
                  <li>Evaluate furcation involvement on tooth #46 — possible surgical intervention</li>
                </ol>
              </ReportSection>
            )}

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-200 text-[10px] text-gray-400 text-center">
              <p>This report was generated by SOJAI AI and should be reviewed by a qualified dental professional.</p>
              <p className="mt-0.5">SOJAI Diagnostics &copy; 2026 — Confidential</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
