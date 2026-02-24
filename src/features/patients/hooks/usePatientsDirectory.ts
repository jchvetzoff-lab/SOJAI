'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Patient, PatientCreateInput, PatientStatus } from '@/features/patients';
import { patientsRepo } from '@/services/patientsRepo';

export type LastScanFilter = 'all' | '7d' | '30d' | 'older';

interface UsePatientsDirectoryResult {
  patients: Patient[];
  filteredPatients: Patient[];
  search: string;
  statusFilter: 'all' | PatientStatus;
  lastScanFilter: LastScanFilter;
  loading: boolean;
  setSearch: (value: string) => void;
  setStatusFilter: (value: 'all' | PatientStatus) => void;
  setLastScanFilter: (value: LastScanFilter) => void;
  createPatient: (input: PatientCreateInput) => Promise<Patient>;
  deletePatient: (id: string) => Promise<boolean>;
  refresh: () => Promise<void>;
}

function daysSince(dateIso: string, now: Date): number {
  const millis = now.getTime() - new Date(dateIso).getTime();
  return Math.floor(millis / 86400000);
}

export function usePatientsDirectory(): UsePatientsDirectoryResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PatientStatus>('all');
  const [lastScanFilter, setLastScanFilter] = useState<LastScanFilter>('all');
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const items = await patientsRepo.list();
    setPatients(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const filteredPatients = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const now = new Date();

    return patients.filter((patient) => {
      if (normalized && !patient.name.toLowerCase().includes(normalized) && !patient.id.toLowerCase().includes(normalized)) {
        return false;
      }

      if (statusFilter !== 'all' && patient.status !== statusFilter) {
        return false;
      }

      if (lastScanFilter !== 'all') {
        const delta = daysSince(patient.lastVisit, now);
        if (lastScanFilter === '7d' && delta > 7) return false;
        if (lastScanFilter === '30d' && delta > 30) return false;
        if (lastScanFilter === 'older' && delta <= 30) return false;
      }

      return true;
    });
  }, [lastScanFilter, patients, search, statusFilter]);

  const createPatient = useCallback(async (input: PatientCreateInput) => {
    const created = await patientsRepo.create(input);
    setPatients((prev) => [created, ...prev]);
    return created;
  }, []);

  const deletePatient = useCallback(async (id: string) => {
    const deleted = await patientsRepo.remove(id);
    if (deleted) {
      setPatients((prev) => prev.filter((item) => item.id !== id));
    }
    return deleted;
  }, []);

  return {
    patients,
    filteredPatients,
    search,
    statusFilter,
    lastScanFilter,
    loading,
    setSearch,
    setStatusFilter,
    setLastScanFilter,
    createPatient,
    deletePatient,
    refresh,
  };
}
