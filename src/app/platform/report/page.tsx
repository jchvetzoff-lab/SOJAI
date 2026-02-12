'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import DentalChart from '@/components/platform/DentalChart';
import ReportSection from '@/components/platform/ReportSection';
import EmptyState from '@/components/platform/EmptyState';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { selectedPatient } from '@/lib/mock-data/patients';
import { pathologies as mockPathologies } from '@/lib/mock-data/pathologies';
import { dentalChartData as mockChartData } from '@/lib/mock-data/dental-chart';
import { reportSections as defaultSections } from '@/lib/mock-data/reports';
import { SEVERITY_LEVELS } from '@/lib/platform-constants';

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Report Generator</h1>
          <p className="text-sm text-gray-500 mt-1">No analysis available</p>
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

    // Pathology table
    if (enabledSections.some((s) => s.id === 'findings')) {
      checkPageBreak(20);
      doc.setFontSize(12);
      doc.setTextColor(26, 26, 46);
      doc.text('AI Findings', margin, y);
      y += 8;

      // Table header
      doc.setFillColor(249, 250, 251);
      doc.rect(margin, y - 3, contentW, 7, 'F');
      doc.setFontSize(8);
      doc.setTextColor(107, 114, 128);
      doc.text('Pathology', margin + 2, y + 1);
      doc.text('Category', margin + 60, y + 1);
      doc.text('Severity', margin + 95, y + 1);
      doc.text('Conf.', margin + 125, y + 1);
      doc.text('Teeth', margin + 145, y + 1);
      y += 7;

      pathologies.forEach((p) => {
        checkPageBreak(8);
        doc.setFontSize(8);
        doc.setTextColor(26, 26, 46);
        doc.text(p.name.substring(0, 30), margin + 2, y);
        doc.setTextColor(107, 114, 128);
        doc.text(p.category, margin + 60, y);

        // Severity colored
        const sevColor = SEVERITY_LEVELS[p.severity].color;
        const r = parseInt(sevColor.slice(1, 3), 16);
        const g = parseInt(sevColor.slice(3, 5), 16);
        const b = parseInt(sevColor.slice(5, 7), 16);
        doc.setTextColor(r, g, b);
        doc.text(p.severity, margin + 95, y);

        doc.setTextColor(26, 26, 46);
        doc.text(`${p.confidence}%`, margin + 125, y);
        doc.text(p.affectedTeeth.join(', '), margin + 145, y);
        y += 5;

        doc.setDrawColor(243, 244, 246);
        doc.line(margin, y - 1, pageW - margin, y - 1);
      });

      y += 6;
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
    doc.text(`SOJAI Diagnostics © ${new Date().getFullYear()} — Confidential`, pageW / 2, footY + 4, { align: 'center' });

    doc.save(`SOJAI-Report-${patient.id}-${new Date().toISOString().split('T')[0]}.pdf`);
  }, [enabledSections, pathologies, patient, recommendations, analysisResult]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Report Generator</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create professional diagnostic reports
          {isDemo && <span className="ml-1 text-amber-500">(demo data)</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-[#1A1A2E] mb-3">Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Clinic Branding</span>
                <button
                  onClick={() => setBranding(!branding)}
                  className={`w-11 h-6 rounded-full transition-colors ${branding ? 'bg-[#4A39C0]' : 'bg-gray-300'}`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${branding ? 'translate-x-5' : 'translate-x-0'}`} />
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

          <div className="space-y-2">
            <button
              onClick={handleDownloadPdf}
              className="w-full py-3 bg-[#4A39C0] text-white rounded-xl text-sm font-medium hover:bg-[#3a2da0] transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="w-full py-3 bg-white text-[#4A39C0] border border-[#4A39C0] rounded-xl text-sm font-medium hover:bg-[#F9F8FF] transition-colors"
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

            {/* Findings */}
            {enabledSections.some((s) => s.id === 'findings') && (
              <ReportSection title="AI Findings">
                <div className="space-y-2">
                  {pathologies.slice(0, 8).map((p) => (
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
                  {pathologies.length > 8 && (
                    <p className="text-[10px] text-gray-400 italic">+ {pathologies.length - 8} more findings</p>
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
              <p className="mt-0.5">SOJAI Diagnostics &copy; {new Date().getFullYear()} — Confidential</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
