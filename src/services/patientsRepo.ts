import type { Patient, PatientCreateInput, PatientUpdateInput } from '@/features/patients';
import { PATIENT_FIXTURES } from '@/lib/fixtures';

const STORAGE_KEY = 'sojai.patientsRepo';

let inMemoryPatients: Patient[] = PATIENT_FIXTURES.map((patient) => ({ ...patient }));
let hydrated = false;

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

export interface PatientsRepo {
  list(): Promise<Patient[]>;
  getById(id: string): Promise<Patient | null>;
  create(input: PatientCreateInput): Promise<Patient>;
  update(id: string, updates: PatientUpdateInput): Promise<Patient | null>;
  remove(id: string): Promise<boolean>;
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

  async resetToFixtures() {
    inMemoryPatients = clonePatients(PATIENT_FIXTURES);
    persistToStorage();
  },
};
