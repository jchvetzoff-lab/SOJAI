'use client';

import { Patient } from '@/lib/mock-data/patients';

interface PatientListItemProps {
  patient: Patient;
  onClick?: () => void;
  selected?: boolean;
}

export default function PatientListItem({ patient, onClick, selected }: PatientListItemProps) {
  const statusColor = patient.status === 'active' ? 'bg-emerald-500' : patient.status === 'pending' ? 'bg-amber-500' : 'bg-[#475569]';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
        selected ? 'bg-[#3B82F6]/10' : 'hover:bg-white/[0.03]'
      }`}
    >
      <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] text-xs font-bold shrink-0">
        {patient.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#E2E8F0] truncate">{patient.name}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor} shrink-0`} />
        </div>
        <div className="text-xs text-[#64748B]">
          {patient.scanCount} scans &middot; {patient.pathologyCount} findings
        </div>
      </div>
      <div className="text-xs text-[#475569] shrink-0">{patient.id}</div>
    </div>
  );
}
