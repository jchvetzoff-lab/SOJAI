'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patientsRepo } from '@/services/patientsRepo';
import type { Patient } from '@/features/patients';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');

  const { selectedPatientId, setSelectedPatientId, setCurrentPatient } = usePlatformStore();

  useEffect(() => {
    let active = true;
    patientsRepo.list().then((items) => {
      if (active) setPatients(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const filteredPatients = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return patients;
    return patients.filter((patient) => {
      return patient.name.toLowerCase().includes(normalized) || patient.id.toLowerCase().includes(normalized);
    });
  }, [patients, search]);

  const activePatient = patients.find((patient) => patient.id === selectedPatientId) ?? null;

  const openPatient = (patient: Patient): void => {
    setSelectedPatientId(patient.id);
    setCurrentPatient({ id: patient.id, name: patient.name, age: patient.age, gender: patient.gender });
    router.push('/platform/patient');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl tracking-tight font-bold text-[#EDEDEF]">Patients</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-1">Select a patient to open the show-off dossier.</p>
        </div>
        <div className="min-w-[280px] flex-1 max-w-sm">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or ID"
            className="w-full bg-[#141416] border border-white/[0.08] rounded-md px-3 py-2 text-[13px] text-[#EDEDEF] outline-none focus:border-[#5B5BD6]/60"
          />
        </div>
      </div>

      {activePatient && (
        <div className="bg-[#141416] border border-[#5B5BD6]/30 rounded-lg p-4">
          <div className="text-[11px] uppercase tracking-wide text-[#8B8B8E]">Selected Patient</div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <div>
              <div className="text-[15px] font-semibold text-[#EDEDEF]">{activePatient.name}</div>
              <div className="text-[12px] text-[#5C5C5F]">{activePatient.id} • {activePatient.age}y • {activePatient.gender}</div>
            </div>
            <button
              onClick={() => openPatient(activePatient)}
              className="px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[12px] font-medium hover:bg-[#6E6ADE] transition-colors"
            >
              Open dossier
            </button>
          </div>
        </div>
      )}

      <div className="bg-[#141416] rounded-lg border border-white/[0.06] overflow-hidden">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-white/[0.02] border-b border-white/[0.06]">
            <tr>
              <th className="px-4 py-3 text-[#5C5C5F] font-medium">Patient</th>
              <th className="px-4 py-3 text-[#5C5C5F] font-medium">ID</th>
              <th className="px-4 py-3 text-[#5C5C5F] font-medium">Scans</th>
              <th className="px-4 py-3 text-[#5C5C5F] font-medium">Pathologies</th>
              <th className="px-4 py-3 text-[#5C5C5F] font-medium">Status</th>
              <th className="px-4 py-3 text-[#5C5C5F] font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-b last:border-b-0 border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="font-medium text-[#EDEDEF]">{patient.name}</div>
                  <div className="text-[11px] text-[#5C5C5F]">{patient.age}y • {patient.gender}</div>
                </td>
                <td className="px-4 py-3 text-[#8B8B8E]">{patient.id}</td>
                <td className="px-4 py-3 text-[#8B8B8E]">{patient.scanCount}</td>
                <td className="px-4 py-3 text-[#8B8B8E]">{patient.pathologyCount}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-[11px] bg-white/[0.05] text-[#8B8B8E]">{patient.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openPatient(patient)}
                    className="px-2.5 py-1.5 rounded-md bg-[#5B5BD6]/20 text-[#C7C6FF] hover:bg-[#5B5BD6]/30 text-[12px]"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPatients.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[#5C5C5F]">No patient matches your search.</div>
        )}
      </div>
    </div>
  );
}
