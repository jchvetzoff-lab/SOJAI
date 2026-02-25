'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { usePatientsDirectory, type LastScanFilter } from '@/features/patients/hooks/usePatientsDirectory';
import PatientsTable from '@/features/patients/components/PatientsTable';
import CreatePatientModal from '@/features/patients/components/CreatePatientModal';
import type { Patient, PatientStatus } from '@/features/patients';

const STATUS_OPTIONS: Array<{ label: string; value: 'all' | PatientStatus }> = [
  { label: 'Tous statuts', value: 'all' },
  { label: 'Actifs', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Completed', value: 'completed' },
];

const LAST_SCAN_OPTIONS: Array<{ label: string; value: LastScanFilter }> = [
  { label: 'Dernier scan: Tous', value: 'all' },
  { label: '≤ 7 jours', value: '7d' },
  { label: '≤ 30 jours', value: '30d' },
  { label: '> 30 jours', value: 'older' },
];

export default function PatientsPage() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);

  const {
    selectedPatientId,
    setSelectedPatientId,
    setCurrentPatient,
  } = usePlatformStore();

  const {
    patients,
    filteredPatients,
    search,
    statusFilter,
    lastScanFilter,
    setSearch,
    setStatusFilter,
    setLastScanFilter,
    createPatient,
    deletePatient,
    loading,
  } = usePatientsDirectory();

  const openPatient = (patient: Patient): void => {
    setSelectedPatientId(patient.id);
    setCurrentPatient({ id: patient.id, name: patient.name, age: patient.age, gender: patient.gender });
    router.push(`/platform/patients/${patient.id}`);
  };

  const handleDelete = async (patient: Patient): Promise<void> => {
    const confirmed = window.confirm(`Supprimer ${patient.name} (${patient.id}) ? (demo)`);
    if (!confirmed) return;

    const deleted = await deletePatient(patient.id);
    if (deleted && selectedPatientId === patient.id) {
      setSelectedPatientId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Patients</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Liste patients, filtres, création et suppression demo.</p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="px-3.5 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px] font-medium hover:bg-[#6E6ADE]"
        >
          Créer patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Recherche nom / ID"
          className="md:col-span-1 w-full bg-[#141416] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'all' | PatientStatus)}
          className="md:col-span-1 w-full bg-[#141416] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <select
          value={lastScanFilter}
          onChange={(event) => setLastScanFilter(event.target.value as LastScanFilter)}
          className="md:col-span-1 w-full bg-[#141416] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
        >
          {LAST_SCAN_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="text-[12px] text-[#5C5C5F]">
        {loading ? 'Chargement...' : `${filteredPatients.length} résultat(s) sur ${patients.length}`}
      </div>

      <PatientsTable
        patients={filteredPatients}
        selectedPatientId={selectedPatientId}
        onOpen={openPatient}
        onDelete={(patient) => {
          void handleDelete(patient);
        }}
      />

      <CreatePatientModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (input) => {
          const created = await createPatient(input);
          setSelectedPatientId(created.id);
          setCurrentPatient({ id: created.id, name: created.name, age: created.age, gender: created.gender });
          router.push(`/platform/patients/${created.id}`);
        }}
      />
    </div>
  );
}
