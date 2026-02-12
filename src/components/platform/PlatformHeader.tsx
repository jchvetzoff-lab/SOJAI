'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { PLATFORM_NAV } from '@/lib/platform-constants';

export default function PlatformHeader() {
  const pathname = usePathname();

  // Build breadcrumb from pathname
  const currentPage = PLATFORM_NAV.find((n) => n.href === pathname);
  const pageTitle = currentPage?.label || 'Dashboard';

  return (
    <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
      {/* Left: breadcrumb */}
      <div className="flex items-center gap-2 text-base">
        <Link href="/platform" className="text-gray-400 hover:text-[#4A39C0] transition-colors">
          Platform
        </Link>
        {pathname !== '/platform' && (
          <>
            <span className="text-gray-300">/</span>
            <span className="text-[#1A1A2E] font-medium">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Right: search + user */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 w-56">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-base text-gray-600 w-full placeholder:text-gray-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-[#4A39C0] transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF3254] rounded-full" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#4A39C0] flex items-center justify-center text-white text-xs font-bold">
            DL
          </div>
          <span className="hidden lg:block text-sm font-medium text-[#1A1A2E]">Dr. Laurent</span>
        </div>
      </div>
    </header>
  );
}
