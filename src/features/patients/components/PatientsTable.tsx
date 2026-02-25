'use client';

import type { Patient } from '@/features/patients';

interface PatientsTableProps {
  patients: Patient[];
  selectedPatientId: string | null;
  onOpen: (patient: Patient) => void;
  onDelete: (patient: Patient) => void;
}

function statusClass(status: Patient['status']): string {
  if (status === 'active') return 'bg-[#30A46C]/15 text-[#6EE7B7]';
  if (status === 'pending') return 'bg-[#E5A836]/15 text-[#FCD34D]';
  return 'bg-white/[0.05] text-[#8B8B8E]';
}

export default function PatientsTable({
  patients,
  selectedPatientId,
  onOpen,
  onDelete,
}: PatientsTableProps) {
  return (
    <div className="bg-[#141416] rounded-lg border border-white/[0.06] overflow-hidden">
      <table className="w-full text-left text-[13px]">
        <thead className="bg-white/[0.02] border-b border-white/[0.06]">
          <tr>
            <th className="px-4 py-3 text-[#5C5C5F] font-medium">Patient</th>
            <th className="px-4 py-3 text-[#5C5C5F] font-medium">ID</th>
            <th className="px-4 py-3 text-[#5C5C5F] font-medium">Last scan</th>
            <th className="px-4 py-3 text-[#5C5C5F] font-medium">Scans</th>
            <th className="px-4 py-3 text-[#5C5C5F] font-medium">Status</th>
            <th className="px-4 py-3 text-[#5C5C5F] font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => {
            const selected = selectedPatientId === patient.id;
            return (
              <tr key={patient.id} className={`border-b last:border-b-0 border-white/[0.04] ${selected ? 'bg-[#5B5BD6]/10' : 'hover:bg-white/[0.02]'}`}>
                <td className="px-4 py-3">
                  <div className="font-medium text-[#EDEDEF]">{patient.name}</div>
                  <div className="text-[11px] text-[#5C5C5F]">{patient.age}y • {patient.gender} • {patient.pathologyCount} findings</div>
                </td>
                <td className="px-4 py-3 text-[#8B8B8E]">{patient.id}</td>
                <td className="px-4 py-3 text-[#8B8B8E]">{patient.lastVisit}</td>
                <td className="px-4 py-3 text-[#8B8B8E]">{patient.scanCount}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-[11px] ${statusClass(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpen(patient)}
                      className="px-2.5 py-1.5 rounded-md bg-[#5B5BD6]/20 text-[#C7C6FF] hover:bg-[#5B5BD6]/30 text-[12px]"
                    >
                      Ouvrir dossier
                    </button>
                    <button
                      onClick={() => onDelete(patient)}
                      className="px-2.5 py-1.5 rounded-md bg-[#E5484D]/15 text-[#FF9DA1] hover:bg-[#E5484D]/25 text-[12px]"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {patients.length === 0 && (
        <div className="px-4 py-8 text-center text-[13px] text-[#5C5C5F]">Aucun patient trouvé.</div>
      )}
    </div>
  );
}
