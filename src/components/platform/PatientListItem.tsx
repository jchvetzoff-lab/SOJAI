'use client';

import { Patient } from '@/lib/mock-data/patients';

interface PatientListItemProps {
  patient: Patient;
  onClick?: () => void;
  selected?: boolean;
}

export default function PatientListItem({ patient, onClick, selected }: PatientListItemProps) {
  const statusColor = patient.status === 'active' ? 'bg-emerald-500' : patient.status === 'pending' ? 'bg-amber-500' : 'bg-gray-400';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all duration-200 ${
        selected ? 'bg-[#E4E1FF]' : 'hover:bg-[#F9F8FF]'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-[#4A39C0] flex items-center justify-center text-white text-xs font-bold shrink-0">
        {patient.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-[#1A1A2E] truncate">{patient.name}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor} shrink-0`} />
        </div>
        <div className="text-[13px] text-gray-400">
          {patient.scanCount} scans &middot; {patient.pathologyCount} findings
        </div>
      </div>
      <div className="text-[13px] text-gray-400 shrink-0">{patient.id}</div>
    </div>
  );
}
