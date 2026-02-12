'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const icons: Record<string, React.ReactNode> = {
  dashboard: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  viewer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  detection: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
    </svg>
  ),
  report: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  '3d': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
    </svg>
  ),
  superimposition: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="14" height="14" rx="2" /><rect x="9" y="6" width="14" height="14" rx="2" />
    </svg>
  ),
  implant: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v6" /><path d="M8 8h8" /><path d="M9 8l-1 14h8l-1-14" /><path d="M10 12h4" /><path d="M10 16h4" />
    </svg>
  ),
  orthodontic: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12c0-4 3.5-8 8-8s8 4 8 8" /><circle cx="8" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="16" cy="12" r="1" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  ),
  periodontal: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C8 2 6 6 6 10c0 2 .5 3.5 1.5 5L12 22l4.5-7c1-1.5 1.5-3 1.5-5 0-4-2-8-6-8z" />
      <circle cx="12" cy="10" r="2" />
    </svg>
  ),
  analytics: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
};

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/platform', icon: 'dashboard' },
    ],
  },
  {
    label: 'Diagnostics',
    items: [
      { label: '2D Viewer', href: '/platform/viewer', icon: 'viewer' },
      { label: 'AI Detection', href: '/platform/detection', icon: 'detection' },
      { label: '3D Viewer', href: '/platform/3d', icon: '3d' },
      { label: 'Reports', href: '/platform/report', icon: 'report' },
    ],
  },
  {
    label: 'Specialties',
    items: [
      { label: 'Superimposition', href: '/platform/superimposition', icon: 'superimposition' },
      { label: 'Implant Planning', href: '/platform/implant', icon: 'implant' },
      { label: 'Orthodontic', href: '/platform/orthodontic', icon: 'orthodontic' },
      { label: 'Periodontal', href: '/platform/periodontal', icon: 'periodontal' },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', href: '/platform/analytics', icon: 'analytics' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col transition-all duration-200 bg-[#0A0A0B] border-r border-white/[0.06] ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 shrink-0">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#5B5BD6] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          {!collapsed && (
            <span className="text-[#EDEDEF] text-sm font-semibold tracking-tight">
              SOJ<span className="text-[#5B5BD6]">AI</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto">
        <div className="space-y-5">
          {navSections.map((section) => (
            <div key={section.label}>
              {!collapsed && (
                <div className="px-2 mb-1.5">
                  <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5C5C5F]">
                    {section.label}
                  </span>
                </div>
              )}
              <div className="space-y-px">
                {section.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-2.5 px-2 py-[7px] rounded-md text-[13px] font-medium transition-colors duration-150 ${
                        active
                          ? 'bg-white/[0.08] text-[#EDEDEF]'
                          : 'text-[#8B8B8E] hover:text-[#EDEDEF] hover:bg-white/[0.04]'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-[#5B5BD6]" />
                      )}
                      <span className="shrink-0 ml-0.5">{icons[item.icon]}</span>
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-white/[0.06] text-[#5C5C5F] hover:text-[#8B8B8E] transition-colors"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
        >
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>
    </aside>
  );
}
