'use client';

import { Patient } from '@/lib/mock-data/patients';

interface PatientListItemProps {
  patient: Patient;
  onClick?: () => void;
  selected?: boolean;
}

export default function PatientListItem({ patient, onClick, selected }: PatientListItemProps) {
  const statusColor = patient.status === 'active' ? 'bg-[#30A46C]' : patient.status === 'pending' ? 'bg-[#E5A836]' : 'bg-[#333338]';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-150 ${
        selected ? 'bg-[#5B5BD6]/10' : 'hover:bg-white/[0.02]'
      }`}
    >
      <div className="w-7 h-7 rounded-full bg-[#5B5BD6]/15 flex items-center justify-center text-[#5B5BD6] text-[10px] font-semibold shrink-0">
        {patient.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-[#EDEDEF] truncate">{patient.name}</span>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor} shrink-0`} />
        </div>
        <div className="text-[11px] text-[#5C5C5F]">{patient.scanCount} scans &middot; {patient.pathologyCount} findings</div>
      </div>
      <div className="text-[11px] text-[#333338] font-mono shrink-0">{patient.id}</div>
    </div>
  );
}
