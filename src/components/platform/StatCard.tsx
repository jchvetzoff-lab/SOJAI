'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  variant?: 'light' | 'dark';
  iconBg?: string;
}

export default function StatCard({ title, value, change, changeType = 'neutral', icon, variant = 'light', iconBg }: StatCardProps) {
  const isDark = variant === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={isDark
        ? 'bg-[#111C32] rounded-2xl p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300'
        : 'bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-shadow duration-300'
      }
    >
      <div className="flex items-start justify-between mb-5">
        <div className={isDark
          ? `w-12 h-12 rounded-xl flex items-center justify-center ${iconBg || 'bg-[#00D4AA]/15 text-[#00D4AA]'}`
          : 'w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E4E1FF] to-[#F5F3FF] flex items-center justify-center text-[#4A39C0]'
        }>
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
            isDark ? (
              changeType === 'positive' ? 'bg-emerald-500/10 text-emerald-400' :
              changeType === 'negative' ? 'bg-red-500/10 text-red-400' :
              'bg-white/5 text-[#64748B]'
            ) : (
              changeType === 'positive' ? 'bg-emerald-50 text-emerald-600' :
              changeType === 'negative' ? 'bg-red-50 text-red-500' :
              'bg-gray-50 text-gray-400'
            )
          }`}>{change}</span>
        )}
      </div>
      <div className={`text-3xl font-bold tracking-tight ${isDark ? 'text-[#E2E8F0]' : 'text-[#1A1A2E]'}`}>{value}</div>
      <div className={`text-sm mt-1.5 ${isDark ? 'text-[#64748B]' : 'text-gray-400'}`}>{title}</div>
    </motion.div>
  );
}
