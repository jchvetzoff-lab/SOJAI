'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PLATFORM_NAV } from '@/lib/platform-constants';

export default function PlatformHeader() {
  const pathname = usePathname();

  const currentPage = PLATFORM_NAV.find((n) => n.href === pathname);
  const pageTitle = currentPage?.label || 'Dashboard';

  return (
    <header className="h-12 bg-[#0A0A0B] border-b border-white/[0.06] flex items-center justify-between px-6 lg:px-8 shrink-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-[13px]">
        <Link href="/platform" className="text-[#5C5C5F] hover:text-[#8B8B8E] transition-colors">
          Platform
        </Link>
        {pathname !== '/platform' && (
          <>
            <span className="text-[#333338]">/</span>
            <span className="text-[#EDEDEF] font-medium">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Right: search + user */}
      <div className="flex items-center gap-3">
        {/* Search — Cmd+K style */}
        <button className="hidden md:flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.06] rounded-md px-3 py-1.5 w-52 border border-white/[0.06] transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C5C5F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="text-[13px] text-[#5C5C5F] flex-1 text-left">Search...</span>
          <kbd className="text-[10px] text-[#5C5C5F] bg-white/[0.06] rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 text-[#5C5C5F] hover:text-[#8B8B8E] transition-colors rounded-md hover:bg-white/[0.04]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#E5484D] rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#5B5BD6] to-[#6E6ADE] flex items-center justify-center text-white text-[10px] font-semibold">
            DL
          </div>
          <span className="hidden lg:block text-[13px] font-medium text-[#8B8B8E]">Dr. Laurent</span>
        </div>
      </div>
    </header>
  );
}
