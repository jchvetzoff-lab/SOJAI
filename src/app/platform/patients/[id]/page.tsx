'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patientsRepo } from '@/services/patientsRepo';
import type {
  Patient,
  PatientAIInsights,
  PatientDocument,
  PatientNote,
  PatientScanImage,
  PatientTimelineEvent,
} from '@/features/patients';

interface PatientByIdPageProps {
  params: { id: string };
}

type DossierTab = 'timeline' | 'scans' | 'notes' | 'documents' | 'insights';

export default function PatientByIdPage({ params }: PatientByIdPageProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [timeline, setTimeline] = useState<PatientTimelineEvent[]>([]);
  const [scans, setScans] = useState<PatientScanImage[]>([]);
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [insights, setInsights] = useState<PatientAIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<DossierTab>('timeline');
  const [generatingReport, setGeneratingReport] = useState(false);

  const { setSelectedPatientId, setCurrentPatient } = usePlatformStore();

  useEffect(() => {
    let active = true;

    Promise.all([
      patientsRepo.getById(params.id),
      patientsRepo.getTimeline(params.id),
      patientsRepo.getScans(params.id),
      patientsRepo.getNotes(params.id),
      patientsRepo.getDocuments(params.id),
      patientsRepo.getAIInsights(params.id),
    ]).then(([foundPatient, foundTimeline, foundScans, foundNotes, foundDocuments, foundInsights]) => {
      if (!active) return;

      setLoading(false);
      setPatient(foundPatient);
      setTimeline(foundTimeline);
      setScans(foundScans);
      setNotes(foundNotes);
      setDocuments(foundDocuments);
      setInsights(foundInsights);

      if (foundPatient) {
        setSelectedPatientId(foundPatient.id);
        setCurrentPatient({
          id: foundPatient.id,
          name: foundPatient.name,
          age: foundPatient.age,
          gender: foundPatient.gender,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [params.id, setCurrentPatient, setSelectedPatientId]);

  const tags = useMemo(() => {
    if (!patient) return [];
    return [
      { label: 'Mock data', tone: 'violet' },
      { label: patient.status, tone: 'neutral' },
      { label: `${patient.pathologyCount} findings`, tone: 'amber' },
    ];
  }, [patient]);

  const handleGenerateReport = async (): Promise<void> => {
    if (!patient || generatingReport) return;
    setGeneratingReport(true);
    try {
      const generated = await patientsRepo.generateReport(patient.id);
      if (!generated) return;
      setDocuments((prev) => [generated, ...prev]);
      setTimeline((prev) => [
        {
          id: `${patient.id}-TL-GEN-${generated.id}`,
          type: 'export',
          at: generated.createdAt,
          title: 'Export PDF generated',
          detail: generated.name,
        },
        ...prev,
      ]);
      setActiveTab('documents');
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto text-[13px] text-[#5C5C5F]">Loading patient dossier...</div>;
  }

  if (!patient) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-6">
          <h1 className="text-xl font-bold text-[#EDEDEF]">Patient not found</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-2">No patient exists with id `{params.id}`.</p>
          <Link href="/platform/patients" className="inline-block mt-4 px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px]">
            Back to Patients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Patient Dossier</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Route: /platform/patients/{patient.id}</p>
        </div>
        <Link href="/platform/patients" className="text-[12px] px-3 py-2 rounded-md bg-white/[0.04] text-[#8B8B8E] hover:bg-white/[0.08]">
          Back to list
        </Link>
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-lg p-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#5B5BD6]/20 text-[#C7C6FF] flex items-center justify-center font-semibold text-[15px]">
              {patient.avatar}
            </div>
            <div>
              <div className="text-[18px] font-semibold text-[#EDEDEF]">{patient.name}</div>
              <div className="text-[12px] text-[#5C5C5F]">{patient.id} • {patient.age}y • {patient.gender} • Last visit {patient.lastVisit}</div>
            </div>
          </div>
          <button
            onClick={() => {
              void handleGenerateReport();
            }}
            disabled={generatingReport}
            className="px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[12px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingReport ? 'Generating...' : 'Generate report (demo)'}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag.label}
              className={`px-2 py-1 rounded-full text-[11px] ${
                tag.tone === 'violet'
                  ? 'bg-[#5B5BD6]/20 text-[#C7C6FF]'
                  : tag.tone === 'amber'
                  ? 'bg-[#E5A836]/20 text-[#FCD34D]'
                  : 'bg-white/[0.05] text-[#8B8B8E]'
              }`}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-[#141416] border border-white/[0.06] rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-white/[0.06] flex flex-wrap gap-2">
          <TabButton active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')} label="Timeline" />
          <TabButton active={activeTab === 'scans'} onClick={() => setActiveTab('scans')} label="Scans/Images" />
          <TabButton active={activeTab === 'notes'} onClick={() => setActiveTab('notes')} label="Notes" />
          <TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')} label="Documents" />
          <TabButton active={activeTab === 'insights'} onClick={() => setActiveTab('insights')} label="AI Insights" />
        </div>

        <div className="p-4">
          {activeTab === 'timeline' && <TimelinePanel events={timeline} />}
          {activeTab === 'scans' && <ScansPanel scans={scans} />}
          {activeTab === 'notes' && <NotesPanel notes={notes} />}
          {activeTab === 'documents' && (
            <DocumentsPanel
              documents={documents}
              onGenerate={() => {
                void handleGenerateReport();
              }}
              generating={generatingReport}
            />
          )}
          {activeTab === 'insights' && <InsightsPanel insights={insights} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-[12px] transition-colors ${
        active ? 'bg-[#5B5BD6]/20 text-[#C7C6FF]' : 'bg-white/[0.03] text-[#8B8B8E] hover:bg-white/[0.06]'
      }`}
    >
      {label}
    </button>
  );
}

function TimelinePanel({ events }: { events: PatientTimelineEvent[] }) {
  if (events.length === 0) return <div className="text-[13px] text-[#5C5C5F]">No timeline events.</div>;
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="text-[13px] font-medium text-[#EDEDEF]">{event.title}</div>
            <span className="text-[11px] text-[#5C5C5F]">{new Date(event.at).toLocaleString()}</span>
          </div>
          <div className="text-[12px] text-[#8B8B8E] mt-1">{event.detail}</div>
        </div>
      ))}
    </div>
  );
}

function ScansPanel({ scans }: { scans: PatientScanImage[] }) {
  if (scans.length === 0) return <div className="text-[13px] text-[#5C5C5F]">No scans available.</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {scans.map((scan) => (
        <div key={scan.id} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="h-24 rounded-md bg-[#0D0D10] border border-white/[0.06] flex items-center justify-center text-[12px] text-[#5C5C5F]">
            {scan.thumbnailLabel}
          </div>
          <div className="mt-2 text-[13px] text-[#EDEDEF]">{scan.modality.toUpperCase()}</div>
          <div className="text-[11px] text-[#5C5C5F]">{new Date(scan.capturedAt).toLocaleString()}</div>
          <div className="text-[11px] text-[#8B8B8E] mt-1">Status: {scan.status}</div>
        </div>
      ))}
    </div>
  );
}

function NotesPanel({ notes }: { notes: PatientNote[] }) {
  if (notes.length === 0) return <div className="text-[13px] text-[#5C5C5F]">No notes yet.</div>;
  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] text-[#8B8B8E]">{note.author}</span>
            <span className="text-[11px] text-[#5C5C5F]">{new Date(note.createdAt).toLocaleString()}</span>
          </div>
          <div className="text-[13px] text-[#EDEDEF] mt-1">{note.text}</div>
        </div>
      ))}
    </div>
  );
}

function DocumentsPanel({
  documents,
  onGenerate,
  generating,
}: {
  documents: PatientDocument[];
  onGenerate: () => void;
  generating: boolean;
}) {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={onGenerate}
          disabled={generating}
          className="px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[12px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {generating ? 'Generating...' : 'Generate report (demo)'}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-[13px] text-[#5C5C5F]">No documents.</div>
      ) : (
        <div className="space-y-2">
          {documents.map((document) => (
            <div key={document.id} className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] text-[#EDEDEF]">{document.name}</div>
                <div className="text-[11px] text-[#5C5C5F]">{document.kind} • {new Date(document.createdAt).toLocaleString()}</div>
              </div>
              <span className="text-[11px] text-[#8B8B8E]">demo</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InsightsPanel({ insights }: { insights: PatientAIInsights | null }) {
  if (!insights) return <div className="text-[13px] text-[#5C5C5F]">No AI insights available.</div>;
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[13px] font-semibold text-[#EDEDEF]">Summary</h3>
        <p className="text-[13px] text-[#8B8B8E] mt-1">{insights.summary}</p>
      </div>
      <div>
        <h3 className="text-[13px] font-semibold text-[#EDEDEF]">Findings</h3>
        <ul className="mt-1 space-y-1">
          {insights.findings.map((finding) => (
            <li key={finding} className="text-[13px] text-[#8B8B8E]">• {finding}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-[13px] font-semibold text-[#EDEDEF]">Recommendations</h3>
        <ul className="mt-1 space-y-1">
          {insights.recommendations.map((recommendation) => (
            <li key={recommendation} className="text-[13px] text-[#8B8B8E]">• {recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
