'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PLATFORM_NAV } from '@/lib/platform-constants';

export default function PlatformHeader() {
  const pathname = usePathname();

  const currentPage = PLATFORM_NAV.find((n) => n.href === pathname);
  const pageTitle = currentPage?.label || 'Dashboard';

  return (
    <header className="h-16 bg-[#0F1A2E]/80 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between px-8 shrink-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2.5 text-sm">
        <Link href="/platform" className="text-[#64748B] hover:text-[#94A3B8] transition-colors">
          Platform
        </Link>
        {pathname !== '/platform' && (
          <>
            <span className="text-[#334155]">/</span>
            <span className="text-[#E2E8F0] font-medium">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Right: search + user */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2.5 bg-white/[0.05] rounded-xl px-3.5 py-2 w-56 border border-white/[0.06]">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-[#E2E8F0] w-full placeholder:text-[#475569]"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-[#64748B] hover:text-[#94A3B8] transition-colors rounded-lg hover:bg-white/[0.05]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#EF4444] rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#6366F1] flex items-center justify-center text-white text-xs font-bold">
            DL
          </div>
          <span className="hidden lg:block text-sm font-medium text-[#CBD5E1]">Dr. Laurent</span>
        </div>
      </div>
    </header>
  );
}
