'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePlatformStore } from '@/hooks/usePlatformStore';

export default function DemoBanner() {
  const { isDemo } = usePlatformStore();
  const [dismissed, setDismissed] = useState(false);

  if (!isDemo || dismissed) return null;

  return (
    <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <span className="text-sm text-amber-300">
          <strong>Demo mode</strong> — You are viewing sample data. Upload a real scan for AI analysis.
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Link
          href="/platform/viewer"
          className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-medium hover:bg-amber-600 transition-colors"
        >
          Upload scan
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-amber-500/60 hover:text-amber-400 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
