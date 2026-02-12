'use client';

import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
}

export default function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColor = changeType === 'positive' ? 'text-emerald-500' : changeType === 'negative' ? 'text-red-500' : 'text-gray-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#E4E1FF] flex items-center justify-center text-[#4A39C0]">
          {icon}
        </div>
        {change && (
          <span className={`text-xs font-medium ${changeColor}`}>{change}</span>
        )}
      </div>
      <div className="text-2xl font-bold text-[#1A1A2E]">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{title}</div>
    </motion.div>
  );
}
