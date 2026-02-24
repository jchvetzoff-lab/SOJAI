'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePlatformStore } from '@/hooks/usePlatformStore';

export default function LegacyPatientRoutePage() {
  const router = useRouter();
  const { selectedPatientId } = usePlatformStore();

  useEffect(() => {
    if (selectedPatientId) {
      router.replace(`/platform/patients/${selectedPatientId}`);
    }
  }, [router, selectedPatientId]);

  if (!selectedPatientId) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-6">
          <h1 className="text-xl font-bold text-[#EDEDEF]">Patient dossier</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-2">No patient selected.</p>
          <Link href="/platform/patients" className="inline-block mt-4 px-3 py-2 rounded-md bg-[#5B5BD6] text-white text-[13px]">
            Go to Patients
          </Link>
        </div>
      </div>
    );
  }

  return <div className="text-[13px] text-[#5C5C5F]">Redirecting to patient dossier...</div>;
}
