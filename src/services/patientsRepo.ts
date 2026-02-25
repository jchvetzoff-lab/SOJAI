import type {
  Patient,
  PatientAIInsights,
  PatientCreateInput,
  PatientDocument,
  PatientNote,
  PatientScanImage,
  PatientTimelineEvent,
  PatientUpdateInput,
} from '@/features/patients';
import { PATIENT_FIXTURES } from '@/lib/fixtures';

const STORAGE_KEY = 'sojai.patientsRepo';

let inMemoryPatients: Patient[] = PATIENT_FIXTURES.map((patient) => ({ ...patient }));
let hydrated = false;
let generatedReportCounter = 0;

function supportsLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function clonePatients(patients: Patient[]): Patient[] {
  return patients.map((patient) => ({ ...patient }));
}

function hydrateFromStorage(): void {
  if (hydrated || !supportsLocalStorage()) return;
  hydrated = true;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw) as Patient[];
    if (Array.isArray(parsed)) {
      inMemoryPatients = parsed.map((patient) => ({ ...patient }));
    }
  } catch {
    inMemoryPatients = clonePatients(PATIENT_FIXTURES);
  }
}

function persistToStorage(): void {
  if (!supportsLocalStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryPatients));
}

function getNextPatientId(): string {
  const max = inMemoryPatients.reduce((acc, patient) => {
    const numeric = Number(patient.id.replace(/^P/, ''));
    return Number.isFinite(numeric) ? Math.max(acc, numeric) : acc;
  }, 0);
  return `P${String(max + 1).padStart(3, '0')}`;
}

function buildTimeline(patient: Patient): PatientTimelineEvent[] {
  return [
    {
      id: `${patient.id}-TL-1`,
      type: 'appointment',
      at: `${patient.lastVisit}T09:00:00.000Z`,
      title: 'Appointment completed',
      detail: 'Clinical control and scan review completed.',
    },
    {
      id: `${patient.id}-TL-2`,
      type: 'analysis',
      at: `${patient.lastVisit}T10:20:00.000Z`,
      title: 'AI analysis run',
      detail: `Automated analysis detected ${patient.pathologyCount} finding(s).`,
    },
    {
      id: `${patient.id}-TL-3`,
      type: 'note',
      at: `${patient.lastVisit}T11:00:00.000Z`,
      title: 'Clinical note added',
      detail: 'Follow-up recommendations documented by practitioner.',
    },
    {
      id: `${patient.id}-TL-4`,
      type: 'export',
      at: `${patient.lastVisit}T11:30:00.000Z`,
      title: 'PDF report exported',
      detail: 'Diagnostic report exported in demo mode.',
    },
  ];
}

function buildScans(patient: Patient): PatientScanImage[] {
  const modalities: PatientScanImage['modality'][] = ['panoramic', 'cbct', 'periapical', 'bitewing'];
  const statusCycle: PatientScanImage['status'][] = ['reviewed', 'analyzed', 'pending'];
  const count = Math.max(2, Math.min(patient.scanCount, 6));

  return Array.from({ length: count }, (_, index) => {
    const dayOffset = index + 1;
    const capturedAt = new Date(Date.UTC(2026, 1, 24 - dayOffset)).toISOString();
    return {
      id: `${patient.id}-SCN-${index + 1}`,
      capturedAt,
      modality: modalities[index % modalities.length],
      status: statusCycle[index % statusCycle.length],
      thumbnailLabel: `Mock Scan ${index + 1}`,
    };
  });
}

function buildNotes(patient: Patient): PatientNote[] {
  return [
    {
      id: `${patient.id}-N-1`,
      createdAt: `${patient.lastVisit}T09:30:00.000Z`,
      author: 'Dr. Demo',
      text: 'Patient informed about findings and treatment options.',
    },
    {
      id: `${patient.id}-N-2`,
      createdAt: `${patient.lastVisit}T10:45:00.000Z`,
      author: 'Assistant Demo',
      text: 'Follow-up slot proposed in two weeks.',
    },
  ];
}

function buildDocuments(patient: Patient): PatientDocument[] {
  return [
    {
      id: `${patient.id}-DOC-1`,
      name: `SOJAI-Initial-Report-${patient.id}.pdf`,
      createdAt: `${patient.lastVisit}T11:30:00.000Z`,
      kind: 'report',
    },
    {
      id: `${patient.id}-DOC-2`,
      name: `SOJAI-Consent-${patient.id}.pdf`,
      createdAt: `${patient.lastVisit}T08:50:00.000Z`,
      kind: 'consent',
    },
  ];
}

function buildInsights(patient: Patient): PatientAIInsights {
  return {
    summary: `Mock AI summary for ${patient.name}: stable profile with ${patient.pathologyCount} current finding(s).`,
    findings: [
      'Periapical radiolucency under review (mock).',
      'Mild periodontal pattern in posterior region (mock).',
      'Restorative follow-up suggested for old filling margins (mock).',
    ],
    recommendations: [
      'Plan follow-up scan in 2-4 weeks.',
      'Review restorative options with patient.',
      'Document periodontal maintenance guidance.',
    ],
  };
}

export interface PatientsRepo {
  list(): Promise<Patient[]>;
  getById(id: string): Promise<Patient | null>;
  create(input: PatientCreateInput): Promise<Patient>;
  update(id: string, updates: PatientUpdateInput): Promise<Patient | null>;
  remove(id: string): Promise<boolean>;
  getTimeline(id: string): Promise<PatientTimelineEvent[]>;
  getScans(id: string): Promise<PatientScanImage[]>;
  getNotes(id: string): Promise<PatientNote[]>;
  getDocuments(id: string): Promise<PatientDocument[]>;
  getAIInsights(id: string): Promise<PatientAIInsights | null>;
  generateReport(id: string): Promise<PatientDocument | null>;
  resetToFixtures(): Promise<void>;
}

export const patientsRepo: PatientsRepo = {
  async list() {
    hydrateFromStorage();
    return clonePatients(inMemoryPatients);
  },

  async getById(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    return patient ? { ...patient } : null;
  },

  async create(input) {
    hydrateFromStorage();
    const created: Patient = {
      id: getNextPatientId(),
      name: input.name,
      age: input.age,
      gender: input.gender,
      lastVisit: '2026-02-24',
      nextAppointment: null,
      scanCount: 0,
      pathologyCount: 0,
      status: 'pending',
      avatar: input.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase(),
    };

    inMemoryPatients = [created, ...inMemoryPatients];
    persistToStorage();
    return { ...created };
  },

  async update(id, updates) {
    hydrateFromStorage();
    const index = inMemoryPatients.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updated: Patient = { ...inMemoryPatients[index], ...updates };
    inMemoryPatients = [
      ...inMemoryPatients.slice(0, index),
      updated,
      ...inMemoryPatients.slice(index + 1),
    ];
    persistToStorage();
    return { ...updated };
  },

  async remove(id) {
    hydrateFromStorage();
    const before = inMemoryPatients.length;
    inMemoryPatients = inMemoryPatients.filter((item) => item.id !== id);
    const changed = inMemoryPatients.length !== before;
    if (changed) persistToStorage();
    return changed;
  },

  async getTimeline(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    if (!patient) return [];
    return buildTimeline(patient);
  },

  async getScans(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    if (!patient) return [];
    return buildScans(patient);
  },

  async getNotes(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    if (!patient) return [];
    return buildNotes(patient);
  },

  async getDocuments(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    if (!patient) return [];
    return buildDocuments(patient);
  },

  async getAIInsights(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    if (!patient) return null;
    return buildInsights(patient);
  },

  async generateReport(id) {
    hydrateFromStorage();
    const patient = inMemoryPatients.find((item) => item.id === id);
    if (!patient) return null;

    generatedReportCounter += 1;
    return {
      id: `${patient.id}-DOC-GEN-${generatedReportCounter}`,
      name: `SOJAI-Generated-Report-${patient.id}-${generatedReportCounter}.pdf`,
      createdAt: new Date(Date.UTC(2026, 1, 24, 12, generatedReportCounter, 0)).toISOString(),
      kind: 'report',
    };
  },

  async resetToFixtures() {
    inMemoryPatients = clonePatients(PATIENT_FIXTURES);
    generatedReportCounter = 0;
    persistToStorage();
  },
};
