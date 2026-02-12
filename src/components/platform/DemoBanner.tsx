'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlatformStore } from '@/hooks/usePlatformStore';

export default function DemoBanner() {
  const { isDemo } = usePlatformStore();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemo || dismissed) return null;

  return (
    <div className="mb-4 bg-[#E5A836]/10 border border-[#E5A836]/15 rounded-md px-3 py-2 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-[#E5A836] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span className="text-[12px] text-[#E5A836]">
          <strong>Demo mode</strong> — Viewing sample data. Upload a real scan for AI analysis.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link href="/platform/viewer" className="px-2.5 py-1 bg-[#E5A836] text-black rounded-md text-[11px] font-medium hover:bg-[#E5A836]/90 transition-colors">
          Upload scan
        </Link>
        <button onClick={() => setDismissed(true)} className="p-0.5 text-[#E5A836]/50 hover:text-[#E5A836] transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
