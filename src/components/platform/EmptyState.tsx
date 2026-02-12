'use client';

import Link from 'next/link';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel = 'Upload a scan',
  ctaHref = '/platform/viewer',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon || (
        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
      <h3 className="text-lg font-semibold text-[#1A1A2E] mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">{description}</p>
      <Link
        href={ctaHref}
        className="px-5 py-2.5 bg-[#4A39C0] text-white rounded-xl text-sm font-medium hover:bg-[#3a2da0] transition-colors"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
