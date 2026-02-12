'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StatCard from '@/components/platform/StatCard';
import PatientListItem from '@/components/platform/PatientListItem';
import { patients } from '@/lib/mock-data/patients';

const activityItems = [
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
  { label: 'Open Viewer', href: '/platform/viewer', icon: '🖥️' },
  { label: 'New Report', href: '/platform/report', icon: '📄' },
  { label: 'AI Detection', href: '/platform/detection', icon: '🔍' },
  { label: 'Analytics', href: '/platform/analytics', icon: '📊' },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your practice activity</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans"
          value="2,847"
          change="+12.5%"
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
        />
        <StatCard
          title="Pathologies Found"
          value="12,394"
          change="+8.2%"
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>}
        />
        <StatCard
          title="Reports Generated"
          value="1,923"
          change="+15.3%"
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        />
        <StatCard
          title="Active Patients"
          value="156"
          change="+3"
          changeType="positive"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Recent Patients</h2>
            <input
              type="text"
              placeholder="Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm bg-gray-50 rounded-lg px-3 py-1.5 border-none outline-none w-48 placeholder:text-gray-400"
            />
          </div>
          <div className="p-2 max-h-[440px] overflow-y-auto">
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-[#E4E1FF] transition-colors text-center"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-xs font-medium text-[#1A1A2E]">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E] mb-3">Recent Activity</h2>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {activityItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.id * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.type === 'alert' ? 'bg-[#FF3254]' :
                    item.type === 'analysis' ? 'bg-[#4A39C0]' :
                    item.type === 'report' ? 'bg-emerald-500' :
                    'bg-gray-300'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1A1A2E] leading-snug">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
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
