'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import StatCard from '@/components/platform/StatCard';
import PatientListItem from '@/components/platform/PatientListItem';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import { patients } from '@/lib/mock-data/patients';

// ── Mock data ──────────────────────────────────────────────
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

const monthlyData = [
  { month: 'Jan', scans: 180 }, { month: 'Feb', scans: 220 }, { month: 'Mar', scans: 195 },
  { month: 'Apr', scans: 260 }, { month: 'May', scans: 240 }, { month: 'Jun', scans: 310 },
  { month: 'Jul', scans: 280 }, { month: 'Aug', scans: 190 }, { month: 'Sep', scans: 330 },
  { month: 'Oct', scans: 290 }, { month: 'Nov', scans: 350 }, { month: 'Dec', scans: 270 },
];

const pathologyDistribution = [
  { label: 'Caries', value: 35, color: '#3B82F6' },
  { label: 'Periapical', value: 22, color: '#F97316' },
  { label: 'Periodontal', value: 18, color: '#00D4AA' },
  { label: 'Other', value: 25, color: '#A855F7' },
];

const severityBreakdown = [
  { label: 'Critical', value: 12, color: '#EF4444' },
  { label: 'Moderate', value: 38, color: '#F97316' },
  { label: 'Mild', value: 50, color: '#00D4AA' },
];

// ── Inline SVG components ──────────────────────────────────

function DonutChart({ data, size = 140, title }: { data: { label: string; value: number; color: string }[]; size?: number; title: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - 20) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const pct = d.value / total;
          const offset = circumference * (1 - cumulative / total);
          cumulative += d.value;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={14}
              strokeDasharray={`${circumference * pct} ${circumference * (1 - pct)}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${cx} ${cy})`}
              className="transition-all duration-700"
            />
          );
        })}
        <text x={cx} y={cy - 6} textAnchor="middle" fill="#E2E8F0" fontSize="20" fontWeight="700" fontFamily="Inter, sans-serif">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">
          Total
        </text>
      </svg>
      <p className="text-sm font-semibold text-[#E2E8F0] mt-3">{title}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 justify-center">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-[#64748B]">{d.label} ({d.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data }: { data: { month: string; scans: number }[] }) {
  const max = Math.max(...data.map((d) => d.scans));
  const barWidth = 28;
  const gap = 12;
  const chartH = 160;
  const svgW = data.length * (barWidth + gap) + gap;

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${chartH + 30}`} preserveAspectRatio="xMidYMid meet">
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line key={i} x1={0} y1={chartH * (1 - pct)} x2={svgW} y2={chartH * (1 - pct)} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      {data.map((d, i) => {
        const h = (d.scans / max) * (chartH - 10);
        const x = gap + i * (barWidth + gap);
        const y = chartH - h;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barWidth} height={h} rx={4} fill="url(#barGrad)" opacity={0.9} />
            <text x={x + barWidth / 2} y={chartH + 16} textAnchor="middle" fill="#64748B" fontSize="10" fontFamily="Inter, sans-serif">
              {d.month}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MiniCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Monday start
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const monthName = now.toLocaleString('en', { month: 'long', year: 'numeric' });

  // Mock appointment days
  const apptDays = [5, 11, 14, 19, 22, 26];

  const cells: (number | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <p className="text-sm font-semibold text-[#E2E8F0] mb-3">{monthName}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d) => (
          <div key={d} className="text-[10px] text-[#64748B] font-medium py-1">{d}</div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            className={`text-xs py-1.5 rounded-lg transition-colors ${
              d === null ? '' :
              d === today ? 'bg-[#3B82F6] text-white font-bold' :
              apptDays.includes(d) ? 'bg-[#00D4AA]/15 text-[#00D4AA] font-medium' :
              'text-[#94A3B8] hover:bg-white/5'
            }`}
          >
            {d || ''}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.06]">
        <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
        <span className="text-[11px] text-[#64748B]">Today</span>
        <span className="w-2 h-2 rounded-full bg-[#00D4AA]" />
        <span className="text-[11px] text-[#64748B]">Appointment</span>
      </div>
    </div>
  );
}

function OralHealthMap() {
  // Simplified dental arch — upper and lower with 16 teeth each
  const upper = [18,17,16,15,14,13,12,11,21,22,23,24,25,26,27,28];
  const lower = [48,47,46,45,44,43,42,41,31,32,33,34,35,36,37,38];
  const pathologyTeeth = [16, 26, 36, 46, 11, 24, 37]; // teeth with findings
  const criticalTeeth = [36, 16]; // critical findings

  const renderArch = (teeth: number[], y: number) => {
    const total = teeth.length;
    return teeth.map((num, i) => {
      const x = 30 + i * 22;
      const isCritical = criticalTeeth.includes(num);
      const hasPathology = pathologyTeeth.includes(num);
      const fill = isCritical ? '#EF4444' : hasPathology ? '#F97316' : '#1E3A5F';
      const stroke = isCritical ? '#EF4444' : hasPathology ? '#F97316' : '#2D5A8E';
      return (
        <g key={num}>
          <rect x={x} y={y} width={18} height={22} rx={4} fill={fill} fillOpacity={isCritical ? 0.3 : hasPathology ? 0.2 : 0.5} stroke={stroke} strokeWidth={1} strokeOpacity={0.6} />
          <text x={x + 9} y={y + 14} textAnchor="middle" fill={isCritical ? '#EF4444' : hasPathology ? '#F97316' : '#64748B'} fontSize="8" fontWeight={hasPathology ? 600 : 400} fontFamily="Inter, sans-serif">
            {num}
          </text>
        </g>
      );
    });
  };

  return (
    <div>
      <svg width="100%" viewBox="0 0 390 120" preserveAspectRatio="xMidYMid meet">
        {/* Arch labels */}
        <text x="10" y="30" fill="#64748B" fontSize="9" fontFamily="Inter, sans-serif">U</text>
        <text x="10" y="90" fill="#64748B" fontSize="9" fontFamily="Inter, sans-serif">L</text>
        {/* Divider */}
        <line x1="30" y1="55" x2="382" y2="55" stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4,4" />
        {/* Center line */}
        <line x1="206" y1="8" x2="206" y2="112" stroke="rgba(255,255,255,0.08)" strokeWidth={1} strokeDasharray="4,4" />
        {renderArch(upper, 12)}
        {renderArch(lower, 65)}
      </svg>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]/30 border border-[#EF4444]/60" />
          <span className="text-[11px] text-[#64748B]">Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#F97316]/20 border border-[#F97316]/60" />
          <span className="text-[11px] text-[#64748B]">Finding</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#1E3A5F]/50 border border-[#2D5A8E]/60" />
          <span className="text-[11px] text-[#64748B]">Healthy</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────

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
        return {
          id: i + 1,
          text: `AI analysis: ${h.summary.substring(0, 60)}${h.summary.length > 60 ? '...' : ''}`,
          time: ago,
          type: 'analysis' as const,
        };
      })
    : [{ id: 1, text: 'No activity yet — upload a scan to get started', time: 'now', type: 'upload' as const }];

  return (
    <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#E2E8F0] tracking-tight">Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">Overview of your practice activity</p>
        </div>

        {/* Row 1 — Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            variant="dark"
            title="Total Scans"
            value={isDemo ? '2,847' : String(totalScans)}
            change={isDemo ? '+12.5%' : `${totalScans} total`}
            changeType="positive"
            iconBg="bg-[#00D4AA]/15 text-[#00D4AA]"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
          />
          <StatCard
            variant="dark"
            title="Pathologies Found"
            value={isDemo ? '12,394' : String(totalPathologies)}
            change={isDemo ? '+8.2%' : `${totalPathologies} total`}
            changeType="positive"
            iconBg="bg-[#F97316]/15 text-[#F97316]"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>}
          />
          <StatCard
            variant="dark"
            title="Reports Generated"
            value={isDemo ? '1,923' : '-'}
            change={isDemo ? '+15.3%' : ''}
            changeType="positive"
            iconBg="bg-[#3B82F6]/15 text-[#3B82F6]"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
          />
          <StatCard
            variant="dark"
            title="Active Patients"
            value={isDemo ? '156' : '1'}
            change={isDemo ? '+3' : ''}
            changeType="positive"
            iconBg="bg-[#A855F7]/15 text-[#A855F7]"
            icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
          />
        </div>

        {/* Row 2 — Upload CTA */}
        <Link href="/platform/viewer">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] rounded-2xl p-6 flex items-center gap-5 hover:brightness-110 transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white">Upload &amp; Analyze a Scan</h2>
              <p className="text-white/50 text-sm mt-0.5">Drop a dental X-ray or CBCT to get instant AI-powered diagnostics</p>
            </div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 opacity-40">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </motion.div>
        </Link>

        {/* Row 3 — Oral Health Map + Calendar/Donuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Oral Health Map */}
          <div className="lg:col-span-2 bg-[#111C32] rounded-2xl border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-[#E2E8F0]">Oral Health Map</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#64748B]">7 findings</span>
                <span className="text-xs text-[#EF4444] font-medium">2 critical</span>
              </div>
            </div>
            <OralHealthMap />
          </div>

          {/* Calendar + Donuts */}
          <div className="space-y-5">
            <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-5">
              <h2 className="text-base font-semibold text-[#E2E8F0] mb-3">Appointments</h2>
              <MiniCalendar />
            </div>
          </div>
        </div>

        {/* Row 4 — Donuts side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 flex justify-center">
            <DonutChart data={pathologyDistribution} title="Pathology Distribution" />
          </div>
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6 flex justify-center">
            <DonutChart data={severityBreakdown} title="Severity Breakdown" />
          </div>
        </div>

        {/* Row 5 — Bar Chart + Recent Patients */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Monthly Activity */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6">
            <h2 className="text-base font-semibold text-[#E2E8F0] mb-5">Monthly Scan Activity</h2>
            <BarChart data={monthlyData} />
          </div>

          {/* Recent Patients */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06]">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#E2E8F0]">Recent Patients</h2>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-sm bg-[#0B1222] rounded-lg px-3 py-2 border border-white/[0.08] outline-none w-40 placeholder:text-[#475569] text-[#E2E8F0] focus:border-[#3B82F6]/40 transition-colors"
              />
            </div>
            <div className="p-3 max-h-[340px] overflow-y-auto">
              {filtered.slice(0, 8).map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-[#3B82F6]/20 flex items-center justify-center text-[#3B82F6] text-xs font-bold shrink-0">
                    {patient.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-[#E2E8F0] truncate block">{patient.name}</span>
                    <span className="text-xs text-[#64748B]">{patient.scanCount} scans &middot; {patient.pathologyCount} findings</span>
                  </div>
                  <span className="text-xs text-[#475569] shrink-0">{patient.id}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-[#64748B] text-center py-8">No patients found</p>
              )}
            </div>
          </div>
        </div>

        {/* Row 6 — Quick Actions + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Quick Actions */}
          <div className="bg-[#111C32] rounded-2xl border border-white/[0.06] p-6">
            <h2 className="text-base font-semibold text-[#E2E8F0] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-200 text-center group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#3B82F6]/15 group-hover:bg-[#3B82F6]/25 flex items-center justify-center text-[#3B82F6] transition-all duration-200">
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#E2E8F0] transition-colors">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 bg-[#111C32] rounded-2xl border border-white/[0.06] p-6">
            <h2 className="text-base font-semibold text-[#E2E8F0] mb-4">Recent Activity</h2>
            <div className="space-y-4 max-h-[280px] overflow-y-auto">
              {activityItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item.id * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    item.type === 'alert' ? 'bg-[#EF4444]' :
                    item.type === 'analysis' ? 'bg-[#3B82F6]' :
                    item.type === 'report' ? 'bg-[#00D4AA]' :
                    'bg-[#475569]'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#CBD5E1] leading-relaxed">{item.text}</p>
                    <p className="text-xs text-[#475569] mt-0.5">{item.time}</p>
                  </div>
                </motion.div>
              ))}
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
