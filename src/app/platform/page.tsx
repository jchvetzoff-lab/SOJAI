'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StatCard from '@/components/platform/StatCard';
import PatientListItem from '@/components/platform/PatientListItem';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patients } from '@/lib/mock-data/patients';

const mockActivityItems = [
  { id: 1, text: 'AI analysis completed for Jean-Pierre Martin', time: '2 min ago', type: 'analysis' },
  { id: 2, text: 'New scan uploaded for Marie Dupont', time: '15 min ago', type: 'upload' },
  { id: 3, text: 'Report sent to François Leroy', time: '1 hour ago', type: 'report' },
  { id: 4, text: 'Critical finding: Periapical lesion on tooth 36', time: '2 hours ago', type: 'alert' },
  { id: 5, text: 'Thomas Weber appointment scheduled', time: '3 hours ago', type: 'schedule' },
  { id: 6, text: 'CBCT scan analyzed (52s) for Klaus Schmidt', time: '4 hours ago', type: 'analysis' },
  { id: 7, text: 'Treatment plan approved for Isabelle Moreau', time: '5 hours ago', type: 'report' },
  { id: 8, text: 'New patient registered: Nathalie Petit', time: '6 hours ago', type: 'patient' },
];

const quickActions = [
  {
    label: 'Open Viewer',
    href: '/platform/viewer',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: 'New Report',
    href: '/platform/report',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'AI Detection',
    href: '/platform/detection',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/platform/analytics',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const { analysisHistory, isDemo } = usePlatformStore();
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  // Dynamic stats from history
  const totalScans = isDemo ? 2847 : analysisHistory.length;
  const totalPathologies = isDemo ? 12394 : analysisHistory.reduce((s, h) => s + h.pathologyCount, 0);

  // Build activity items from history or use mock
  const activityItems = isDemo
    ? mockActivityItems
    : analysisHistory.length > 0
    ? analysisHistory.slice(0, 8).map((h, i) => {
        const date = new Date(h.analyzedAt);
        const ago = getTimeAgo(date);
        return {
          id: i + 1,
          text: `AI analysis: ${h.summary.substring(0, 60)}${h.summary.length > 60 ? '...' : ''}`,
          time: ago,
          type: 'analysis' as const,
        };
      })
    : [{ id: 1, text: 'No activity yet — upload a scan to get started', time: 'now', type: 'upload' as const }];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A2E]">Dashboard</h1>
        <p className="text-base text-gray-500 mt-2">Overview of your practice activity</p>
      </div>

      {/* Upload CTA */}
      <Link href="/platform/viewer">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#4A39C0] to-[#6D5DD3] rounded-2xl p-6 flex items-center gap-5 shadow-md hover:shadow-lg transition-all hover:scale-[1.005] cursor-pointer"
        >
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Upload &amp; Analyze a Scan</h2>
            <p className="text-white/70 text-sm mt-0.5">Drop a dental X-ray or CBCT to get instant AI-powered diagnostics</p>
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-60">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.div>
      </Link>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Scans"
          value={isDemo ? '2,847' : String(totalScans)}
          change={isDemo ? '+12.5%' : `${totalScans} total`}
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
        />
        <StatCard
          title="Pathologies Found"
          value={isDemo ? '12,394' : String(totalPathologies)}
          change={isDemo ? '+8.2%' : `${totalPathologies} total`}
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>}
        />
        <StatCard
          title="Reports Generated"
          value={isDemo ? '1,923' : '-'}
          change={isDemo ? '+15.3%' : ''}
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        />
        <StatCard
          title="Active Patients"
          value={isDemo ? '156' : '1'}
          change={isDemo ? '+3' : ''}
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patients list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Recent Patients</h2>
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm bg-gray-50 rounded-lg px-4 py-2 border-none outline-none w-48 placeholder:text-gray-400"
            />
          </div>
          <div className="p-3 max-h-[440px] overflow-y-auto">
            {filtered.slice(0, 10).map((patient) => (
              <PatientListItem key={patient.id} patient={patient} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No patients found</p>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-gray-50 hover:bg-[#E4E1FF] transition-colors text-center group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E4E1FF] group-hover:bg-[#4A39C0] flex items-center justify-center text-[#4A39C0] group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-[#1A1A2E]">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {activityItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.id * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === 'alert' ? 'bg-[#FF3254]' :
                    item.type === 'analysis' ? 'bg-[#4A39C0]' :
                    item.type === 'report' ? 'bg-emerald-500' :
                    'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-[#1A1A2E] leading-snug">{item.text}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}
