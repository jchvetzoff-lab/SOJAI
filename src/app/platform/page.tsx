'use client';

import { useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/platform/StatCard';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patients } from '@/lib/mock-data/patients';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

// ── Data ──────────────────────────────────────────────
const monthlyData = [
  { month: 'Jan', scans: 180 }, { month: 'Feb', scans: 220 }, { month: 'Mar', scans: 195 },
  { month: 'Apr', scans: 260 }, { month: 'May', scans: 240 }, { month: 'Jun', scans: 310 },
  { month: 'Jul', scans: 280 }, { month: 'Aug', scans: 190 }, { month: 'Sep', scans: 330 },
  { month: 'Oct', scans: 290 }, { month: 'Nov', scans: 350 }, { month: 'Dec', scans: 270 },
];

const pathologyDistribution = [
  { name: 'Caries', value: 35, color: '#5B5BD6' },
  { name: 'Periapical', value: 22, color: '#E5484D' },
  { name: 'Periodontal', value: 18, color: '#30A46C' },
  { name: 'Other', value: 25, color: '#5C5C5F' },
];

const quickActions = [
  {
    label: 'Open Viewer',
    href: '/platform/viewer',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    label: 'New Report',
    href: '/platform/report',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    label: 'AI Detection',
    href: '/platform/detection',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
      </svg>
    ),
  },
  {
    label: 'Analytics',
    href: '/platform/analytics',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
];

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

// ── Custom tooltip ──────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C1C1F] border border-white/[0.08] rounded-md px-3 py-2 text-[12px] shadow-xl">
      <p className="text-[#8B8B8E]">{label}</p>
      <p className="text-[#EDEDEF] font-semibold">{payload[0].value} scans</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────
export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const { analysisHistory, isDemo } = usePlatformStore();
  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalScans = isDemo ? 2847 : analysisHistory.length;
  const totalPathologies = isDemo ? 12394 : analysisHistory.reduce((s, h) => s + h.pathologyCount, 0);

  const activityItems = isDemo
    ? mockActivityItems
    : analysisHistory.length > 0
    ? analysisHistory.slice(0, 8).map((h, i) => {
        const date = new Date(h.analyzedAt);
        const ago = getTimeAgo(date);
        return { id: i + 1, text: `AI analysis: ${h.summary.substring(0, 60)}...`, time: ago, type: 'analysis' as const };
      })
    : [{ id: 1, text: 'No activity yet — upload a scan to get started', time: 'now', type: 'upload' as const }];

  return (
    <div className="max-w-6xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#EDEDEF] tracking-tight">Dashboard</h1>
          <p className="text-[13px] text-[#5C5C5F] mt-0.5">Overview of your practice activity</p>
        </div>
        <Link
          href="/platform/viewer"
          className="flex items-center gap-2 bg-[#5B5BD6] hover:bg-[#6E6ADE] text-white text-[13px] font-medium px-3.5 py-2 rounded-md transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          Upload Scan
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Scans"
          value={isDemo ? '2,847' : String(totalScans)}
          change={isDemo ? '+12.5%' : undefined}
          changeType="positive"
          iconBg="bg-[#30A46C]/15 text-[#30A46C]"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
        />
        <StatCard
          title="Pathologies Found"
          value={isDemo ? '12,394' : String(totalPathologies)}
          change={isDemo ? '+8.2%' : undefined}
          changeType="positive"
          iconBg="bg-[#E5484D]/15 text-[#E5484D]"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>}
        />
        <StatCard
          title="Reports Generated"
          value={isDemo ? '1,923' : '-'}
          change={isDemo ? '+15.3%' : undefined}
          changeType="positive"
          iconBg="bg-[#5B5BD6]/15 text-[#5B5BD6]"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        />
        <StatCard
          title="Active Patients"
          value={isDemo ? '156' : '1'}
          change={isDemo ? '+3' : undefined}
          changeType="positive"
          iconBg="bg-[#E5A836]/15 text-[#E5A836]"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Area chart — 2/3 */}
        <div className="lg:col-span-2 bg-[#141416] rounded-lg border border-white/[0.06] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF]">Scan Activity</h2>
            <span className="text-[11px] text-[#5C5C5F]">Last 12 months</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B5BD6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#5B5BD6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5C5C5F' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#5C5C5F' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="scans" stroke="#5B5BD6" strokeWidth={2} fill="url(#scanGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Donut — 1/3 */}
        <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-5">
          <h2 className="text-[13px] font-semibold text-[#EDEDEF] mb-4">Pathology Distribution</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={pathologyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pathologyDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
            {pathologyDistribution.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-[11px] text-[#8B8B8E]">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Recent Patients — 2/3 */}
        <div className="lg:col-span-2 bg-[#141416] rounded-lg border border-white/[0.06]">
          <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF]">Recent Patients</h2>
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-[12px] bg-white/[0.04] rounded-md px-2.5 py-1.5 border border-white/[0.06] outline-none w-36 placeholder:text-[#5C5C5F] text-[#EDEDEF] focus:border-[#5B5BD6]/40 transition-colors"
            />
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.slice(0, 6).map((patient) => (
              <div key={patient.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-full bg-[#5B5BD6]/15 flex items-center justify-center text-[#5B5BD6] text-[10px] font-semibold shrink-0">
                  {patient.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[13px] font-medium text-[#EDEDEF] truncate block">{patient.name}</span>
                  <span className="text-[11px] text-[#5C5C5F]">{patient.scanCount} scans &middot; {patient.pathologyCount} findings</span>
                </div>
                <span className="text-[11px] text-[#333338] font-mono shrink-0">{patient.id}</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-[13px] text-[#5C5C5F] text-center py-6">No patients found</p>
            )}
          </div>
        </div>

        {/* Right column: Quick Actions + Activity */}
        <div className="space-y-3">
          {/* Quick Actions */}
          <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-4">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-md bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-150 text-center group"
                >
                  <div className="text-[#5C5C5F] group-hover:text-[#EDEDEF] transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-[11px] font-medium text-[#5C5C5F] group-hover:text-[#8B8B8E] transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-[#141416] rounded-lg border border-white/[0.06] p-4">
            <h2 className="text-[13px] font-semibold text-[#EDEDEF] mb-3">Recent Activity</h2>
            <div className="space-y-2.5 max-h-[240px] overflow-y-auto">
              {activityItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === 'alert' ? 'bg-[#E5484D]' :
                    item.type === 'analysis' ? 'bg-[#5B5BD6]' :
                    item.type === 'report' ? 'bg-[#30A46C]' :
                    'bg-[#333338]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#8B8B8E] leading-relaxed">{item.text}</p>
                    <p className="text-[11px] text-[#333338] mt-0.5">{item.time}</p>
                  </div>
                </div>
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
