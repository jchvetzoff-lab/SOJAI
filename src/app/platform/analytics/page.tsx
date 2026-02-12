'use client';

import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from 'recharts';
import MetricCard from '@/components/platform/MetricCard';
import DataTable from '@/components/platform/DataTable';
import EmptyState from '@/components/platform/EmptyState';
import { usePlatformStore } from '@/hooks/usePlatformStore';
import {
  monthlyScans as mockMonthlyScans,
  pathologyDistribution as mockPathologyDistribution,
  weeklyTrend as mockWeeklyTrend,
  practitionerPerformance,
  PractitionerPerformance,
} from '@/lib/mock-data/analytics';

type Period = '7d' | '30d' | '90d' | '1y';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const { analysisHistory, isDemo } = usePlatformStore();

  // Filter history by period
  const filteredHistory = useMemo(() => {
    if (isDemo) return [];
    const now = Date.now();
    const msMap: Record<Period, number> = {
      '7d': 7 * 86400000,
      '30d': 30 * 86400000,
      '90d': 90 * 86400000,
      '1y': 365 * 86400000,
    };
    const cutoff = now - msMap[period];
    return analysisHistory.filter((h) => new Date(h.analyzedAt).getTime() >= cutoff);
  }, [analysisHistory, period, isDemo]);

  // Generate chart data from history (or use mock)
  const monthlyScans = isDemo ? mockMonthlyScans : generateMonthlyFromHistory(filteredHistory);
  const pathologyDistribution = isDemo ? mockPathologyDistribution : generatePathologyDist(filteredHistory);
  const weeklyTrend = isDemo ? mockWeeklyTrend : generateWeeklyTrend(filteredHistory);

  const totalScans = isDemo ? 2847 : filteredHistory.length;
  const totalPathologies = isDemo ? undefined : filteredHistory.reduce((s, h) => s + h.pathologyCount, 0);

  // Show empty state if not demo and no history
  if (!isDemo && analysisHistory.length === 0) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">No data available</p>
        </div>
        <EmptyState
          title="No analytics data yet"
          description="Upload and analyze dental scans to start generating analytics and insights."
        />
      </div>
    );
  }

  const columns = [
    { key: 'name', label: 'Practitioner', sortable: true },
    { key: 'scansReviewed', label: 'Scans', sortable: true },
    { key: 'avgReviewTime', label: 'Avg. Time', sortable: true },
    {
      key: 'accuracy',
      label: 'Accuracy',
      sortable: true,
      render: (row: PractitionerPerformance) => (
        <span className={`font-medium ${row.accuracy >= 98 ? 'text-emerald-500' : row.accuracy >= 97 ? 'text-[#4A39C0]' : 'text-amber-500'}`}>
          {row.accuracy}%
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A2E]">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Practice performance and insights
            {isDemo && <span className="ml-1 text-amber-500">(demo data)</span>}
          </p>
        </div>
        <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
          {(['7d', '30d', '90d', '1y'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p ? 'bg-[#4A39C0] text-white' : 'text-gray-500 hover:text-[#1A1A2E]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Scans"
          value={isDemo ? '2,847' : String(totalScans)}
          subtitle="This period"
          trend={isDemo ? { value: '12.5%', positive: true } : undefined}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
        />
        <MetricCard
          title="Avg. Analysis Time"
          value={isDemo ? '12.4s' : '-'}
          subtitle="Per scan"
          trend={isDemo ? { value: '8%', positive: true } : undefined}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>}
          color="#10B981"
        />
        <MetricCard
          title="Pathologies Found"
          value={isDemo ? '97.8%' : String(totalPathologies)}
          subtitle={isDemo ? 'Sensitivity' : 'This period'}
          trend={isDemo ? { value: '0.3%', positive: true } : undefined}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
          color="#F59E0B"
        />
        <MetricCard
          title="Reports Sent"
          value={isDemo ? '342' : '-'}
          subtitle="This period"
          trend={isDemo ? { value: '15%', positive: true } : undefined}
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
          color="#FF3254"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly scans bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-[#1A1A2E] mb-4">Scans by Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyScans}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="panoramic" fill="#4A39C0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cbct" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="periapical" fill="#FF3254" radius={[4, 4, 0, 0]} />
              <Bar dataKey="bitewing" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pathology distribution pie chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-[#1A1A2E] mb-4">Pathology Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pathologyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="value"
              >
                {pathologyDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly trend */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h3 className="font-semibold text-[#1A1A2E] mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="scans" stroke="#4A39C0" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="findings" stroke="#FF3254" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Practitioner performance */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-[#1A1A2E]">Practitioner Performance</h3>
          </div>
          <div className="p-4">
            <DataTable
              columns={columns}
              data={practitionerPerformance}
              keyField="name"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for generating chart data from analysis history
function generateMonthlyFromHistory(history: { imageType: string; analyzedAt: string }[]) {
  const months: Record<string, { panoramic: number; cbct: number; periapical: number; bitewing: number }> = {};
  history.forEach((h) => {
    const d = new Date(h.analyzedAt);
    const key = d.toLocaleString('en', { month: 'short' });
    if (!months[key]) months[key] = { panoramic: 0, cbct: 0, periapical: 0, bitewing: 0 };
    const type = h.imageType as keyof typeof months[string];
    if (type in months[key]) months[key][type]++;
    else months[key].panoramic++;
  });
  return Object.entries(months).map(([month, data]) => ({ month, ...data }));
}

function generatePathologyDist(history: { pathologyCount: number; imageType: string }[]) {
  // Simple distribution based on count
  const total = history.reduce((s, h) => s + h.pathologyCount, 0);
  if (total === 0) return [{ name: 'None', value: 1, color: '#9CA3AF' }];
  return [
    { name: 'Detected', value: total, color: '#FF3254' },
    { name: 'Clean scans', value: Math.max(1, history.filter((h) => h.pathologyCount === 0).length), color: '#10B981' },
  ];
}

function generateWeeklyTrend(history: { analyzedAt: string; pathologyCount: number }[]) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = days.map((day) => ({ day, scans: 0, findings: 0 }));
  history.forEach((h) => {
    const d = new Date(h.analyzedAt).getDay();
    const idx = d === 0 ? 6 : d - 1; // Sunday=6
    data[idx].scans++;
    data[idx].findings += h.pathologyCount;
  });
  return data;
}
