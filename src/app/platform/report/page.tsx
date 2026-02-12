'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import ReportSection from '@/components/platform/ReportSection';
import PathologyBadge from '@/components/platform/PathologyBadge';
import EmptyState from '@/components/platform/EmptyState';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { selectedPatient } from '@/lib/mock-data/patients';
import { pathologies as mockPathologies } from '@/lib/mock-data/pathologies';
import { dentalChartData as mockChartData } from '@/lib/mock-data/dental-chart';
import { reportSections as defaultSections } from '@/lib/mock-data/reports';
import { PATHOLOGY_CATEGORIES, SEVERITY_LEVELS } from '@/lib/platform-constants';
import { getToothName } from '@/lib/dental-utils';

export default function ReportPage() {
  const [sections, setSections] = useState(defaultSections);
  const [language, setLanguage] = useState('en');
  const [branding, setBranding] = useState(true);

  const { analysisResult, currentPatient, isDemo } = usePlatformStore();

  const pathologies = !isDemo && analysisResult ? analysisResult.pathologies : mockPathologies;
  const chartData = !isDemo && analysisResult?.dentalChart
    ? (analysisResult.dentalChart as Record<number, import('@/lib/mock-data/dental-chart').ToothData>)
    : mockChartData;
  const patient = isDemo ? selectedPatient : currentPatient;
  const recommendations = !isDemo && analysisResult
    ? analysisResult.recommendations
    : [
        'Urgent evaluation of periapical lesion on tooth #36 — consider endodontic retreatment',
        'Monitor suspected vertical root fracture on tooth #14 — CBCT recommended',
        'Restore proximal caries on teeth #15–16 before further progression',
        'Periodontal assessment for generalized bone loss in mandibular anterior region',
        'Evaluate furcation involvement on tooth #46 — possible surgical intervention',
      ];

  // Group pathologies by tooth
  const findingsByTooth = useMemo(() => {
    const map = new Map<number, typeof pathologies>();
    pathologies.forEach((p) => {
      p.affectedTeeth.forEach((t) => {
        if (!map.has(t)) map.set(t, []);
        map.get(t)!.push(p);
      });
    });
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [pathologies]);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const enabledSections = sections.filter((s) => s.enabled);

  // If not demo and no analysis
  if (!isDemo && !analysisResult) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl tracking-tight font-bold text-[#E2E8F0]">Report Generator</h1>
          <p className="text-lg text-[#64748B] mt-3">No analysis available</p>
        </div>
        <EmptyState
          title="No analysis to report"
          description="Upload and analyze a dental scan first to generate a professional diagnostic report."
        />
      </div>
    );
  }

  const handleDownloadPdf = useCallback(async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 20;

    const checkPageBreak = (needed: number) => {
      if (y + needed > 275) {
        doc.addPage();
        y = 20;
      }
    };

    // Header
    if (enabledSections.some((s) => s.id === 'header')) {
      doc.setFillColor(74, 57, 192);
      doc.rect(margin, y, contentW, 0.8, 'F');
      y += 4;
      doc.setFontSize(18);
      doc.setTextColor(26, 26, 46);
      doc.text('SOJAI Diagnostics', margin, y + 6);
      doc.setFontSize(9);
      doc.setTextColor(156, 163, 175);
      doc.text('AI-Powered Dental Analysis Report', margin, y + 12);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageW - margin, y + 6, { align: 'right' });
      doc.text(`Report #${patient.id}-RPT`, pageW - margin, y + 12, { align: 'right' });
      y += 20;
      doc.setDrawColor(229, 231, 235);
      doc.line(margin, y, pageW - margin, y);
      y += 8;
    }

    // Patient info
    if (enabledSections.some((s) => s.id === 'patient')) {
      checkPageBreak(30);
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 46);
      doc.text('Patient Information', margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(107, 114, 128);
      const patientLines = [
        [`Name: ${patient.name}`, `ID: ${patient.id}`],
        [`Age: ${patient.age}`, `Gender: ${patient.gender === 'M' ? 'Male' : 'Female'}`],
      ];
      patientLines.forEach((row) => {
        doc.text(row[0], margin, y);
        doc.text(row[1], margin + contentW / 2, y);
        y += 5;
      });
      y += 6;
    }

    // Summary
    if (analysisResult?.summary && enabledSections.some((s) => s.id === 'findings')) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 46);
      doc.text('Analysis Summary', margin, y);
      y += 6;
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      const summaryLines = doc.splitTextToSize(analysisResult.summary, contentW);
      doc.text(summaryLines, margin, y);
      y += summaryLines.length * 4.5 + 6;
    }

    // Findings by tooth (new Diagnocat-style)
    if (enabledSections.some((s) => s.id === 'findings')) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 46);
      doc.text('AI Findings by Tooth', margin, y);
      y += 8;

      findingsByTooth.forEach(([toothNum, findings]) => {
        checkPageBreak(25);

        // Tooth header
        doc.setFillColor(26, 26, 46);
        doc.roundedRect(margin, y - 3, 12, 7, 1.5, 1.5, 'F');
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text(String(toothNum), margin + 6, y + 1, { align: 'center' });

        doc.setFontSize(9);
        doc.setTextColor(26, 26, 46);
        doc.text(`Tooth ${toothNum} — ${getToothName(toothNum)}`, margin + 15, y + 1);

        // Category tags
        let tagX = margin + 15;
        const tagY = y + 5;
        findings.forEach((f) => {
          const cat = PATHOLOGY_CATEGORIES[f.category];
          const r = parseInt(cat.solidBg.slice(1, 3), 16);
          const g = parseInt(cat.solidBg.slice(3, 5), 16);
          const b = parseInt(cat.solidBg.slice(5, 7), 16);
          const tagWidth = doc.getTextWidth(cat.label) + 4;
          doc.setFillColor(r, g, b);
          doc.roundedRect(tagX, tagY - 2.5, tagWidth, 4, 1, 1, 'F');
          doc.setFontSize(6);
          doc.setTextColor(255, 255, 255);
          doc.text(cat.label, tagX + 2, tagY + 0.5);
          tagX += tagWidth + 2;
        });
        y = tagY + 4;

        // Finding details
        findings.forEach((f) => {
          checkPageBreak(10);
          doc.setFontSize(8);
          doc.setTextColor(26, 26, 46);
          doc.text(`${f.name}`, margin + 15, y);

          const sevColor = SEVERITY_LEVELS[f.severity].color;
          const sr = parseInt(sevColor.slice(1, 3), 16);
          const sg = parseInt(sevColor.slice(3, 5), 16);
          const sb = parseInt(sevColor.slice(5, 7), 16);
          doc.setTextColor(sr, sg, sb);
          doc.text(`${f.severity} — ${f.confidence}%`, margin + 80, y);
          y += 4;

          doc.setFontSize(7);
          doc.setTextColor(107, 114, 128);
          const descLines = doc.splitTextToSize(f.description, contentW - 15);
          doc.text(descLines, margin + 15, y);
          y += descLines.length * 3.5 + 2;
        });

        y += 3;
        doc.setDrawColor(243, 244, 246);
        doc.line(margin, y, pageW - margin, y);
        y += 4;
      });

      y += 4;
    }

    // Recommendations
    if (enabledSections.some((s) => s.id === 'recommendations')) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 46);
      doc.text('Recommendations', margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setTextColor(75, 85, 99);
      recommendations.forEach((rec, i) => {
        checkPageBreak(10);
        const recLines = doc.splitTextToSize(`${i + 1}. ${rec}`, contentW - 5);
        doc.text(recLines, margin + 2, y);
        y += recLines.length * 4.5 + 2;
      });
      y += 4;
    }

    // Footer
    checkPageBreak(15);
    const footY = 285;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, footY - 5, pageW - margin, footY - 5);
    doc.setFontSize(7);
    doc.setTextColor(156, 163, 175);
    doc.text('This report was generated by SOJAI AI and should be reviewed by a qualified dental professional.', pageW / 2, footY, { align: 'center' });
    doc.text(`SOJAI Diagnostics \u00A9 ${new Date().getFullYear()} \u2014 Confidential`, pageW / 2, footY + 4, { align: 'center' });

    doc.save(`SOJAI-Report-${patient.id}-${new Date().toISOString().split('T')[0]}.pdf`);
  }, [enabledSections, pathologies, patient, recommendations, analysisResult, findingsByTooth]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl tracking-tight font-bold text-[#E2E8F0]">Report Generator</h1>
        <p className="text-lg text-[#64748B] mt-3">
          Create professional diagnostic reports
          {isDemo && <span className="ml-1 text-amber-500">(demo data)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-[#94A3B8]">Clinic Branding</span>
                <button
                  onClick={() => setBranding(!branding)}
                  className={`w-11 h-6 rounded-full transition-colors ${branding ? 'bg-[#3B82F6]' : 'bg-[#334155]'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${branding ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </label>
              <div>
                <label className="text-sm text-[#94A3B8] block mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-[#0B1222] rounded-lg px-3 py-2 text-sm text-[#E2E8F0] border border-white/[0.08] outline-none focus:border-[#3B82F6]/40"
                >
                  <option value="en">English</option>
                  <option value="fr">Fran{'\u00E7'}ais</option>
                  <option value="de">Deutsch</option>
                  <option value="es">Espa{'\u00F1'}ol</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 transition-all duration-300">
            <h3 className="text-sm font-semibold text-[#E2E8F0] mb-3">Report Sections</h3>
            <div className="space-y-2">
              {sections.map((s) => (
                <label key={s.id} className="flex items-center justify-between py-1 cursor-pointer">
                  <span className={`text-sm ${s.enabled ? 'text-[#E2E8F0]' : 'text-[#64748B]'}`}>{s.title}</span>
                  <button
                    onClick={() => toggleSection(s.id)}
                    className={`w-8 h-4 rounded-full transition-colors ${s.enabled ? 'bg-[#3B82F6]' : 'bg-white/[0.04]'}`}
                  >
                    <span className={`block w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5 ${s.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-3.5 bg-[#3B82F6] text-white rounded-2xl text-base font-medium hover:bg-[#2563EB] transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="w-full py-3.5 bg-[#111C32] text-[#3B82F6] border border-white/[0.1] rounded-2xl text-base font-medium hover:bg-[#3B82F6]/10 transition-colors"
            >
              Print Preview
            </button>
          </div>
        </div>

        {/* A4 Preview */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-black/[0.08] p-10 min-h-[800px]"
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
                    <p>Report #{patient.id}-RPT</p>
                    <p>Generated: {new Date().toLocaleDateString()}</p>
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
                    <span className="font-medium text-[#1A1A2E]">{patient.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ID:</span>
                    <span className="font-medium text-[#1A1A2E]">{patient.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium text-[#1A1A2E]">{patient.age}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium text-[#1A1A2E]">{patient.gender === 'M' ? 'Male' : 'Female'}</span>
                  </div>
                </div>
              </ReportSection>
            )}

            {/* Summary */}
            {analysisResult?.summary && enabledSections.some((s) => s.id === 'dental_chart') && (
              <ReportSection title="Summary">
                <p className="text-sm text-gray-600 leading-relaxed">{analysisResult.summary}</p>
              </ReportSection>
            )}

            {/* Dental chart */}
            {enabledSections.some((s) => s.id === 'dental_chart') && (
              <ReportSection title="Dental Chart">
                <DentalChart
                  compact
                  highlightTeeth={pathologies.flatMap((p) => p.affectedTeeth)}
                  chartData={chartData}
                />
              </ReportSection>
            )}

            {/* Findings by tooth — Diagnocat style */}
            {enabledSections.some((s) => s.id === 'findings') && (
              <ReportSection title="AI Findings">
                <div className="space-y-3">
                  {findingsByTooth.slice(0, 6).map(([toothNum, findings]) => (
                    <div key={toothNum} className="border border-gray-100 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#1A1A2E] text-white text-[10px] font-bold">
                          {toothNum}
                        </span>
                        <span className="text-xs font-semibold text-[#1A1A2E]">Tooth {toothNum}</span>
                        <span className="text-[10px] text-gray-400">{getToothName(toothNum)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {findings.map((f) => (
                          <PathologyBadge key={f.id} category={f.category} variant="solid" size="sm" />
                        ))}
                      </div>
                      {findings.map((f) => (
                        <div key={f.id} className="flex items-start gap-1.5 text-[10px] mb-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1 shrink-0"
                            style={{ backgroundColor: PATHOLOGY_CATEGORIES[f.category].solidBg }}
                          />
                          <span className="text-gray-600">
                            <span className="font-medium text-[#1A1A2E]">{f.name}</span>
                            {' '}&mdash; {f.confidence}% confidence
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {findingsByTooth.length > 6 && (
                    <p className="text-[10px] text-gray-400 italic">+ {findingsByTooth.length - 6} more teeth with findings</p>
                  )}
                </div>
              </ReportSection>
            )}

            {/* Recommendations */}
            {enabledSections.some((s) => s.id === 'recommendations') && (
              <ReportSection title="Recommendations">
                <ol className="list-decimal list-inside space-y-2 text-xs text-gray-600">
                  {recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ol>
              </ReportSection>
            )}

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-gray-200 text-[10px] text-gray-400 text-center">
              <p>This report was generated by SOJAI AI and should be reviewed by a qualified dental professional.</p>
              <p className="mt-0.5">SOJAI Diagnostics &copy; {new Date().getFullYear()} &mdash; Confidential</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
