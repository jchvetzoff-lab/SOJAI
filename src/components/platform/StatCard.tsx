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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-shadow duration-300"
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E4E1FF] to-[#F5F3FF] flex items-center justify-center text-[#4A39C0]">
          {icon}
        </div>
        {change && (
          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
            changeType === 'positive' ? 'bg-emerald-50 text-emerald-600' :
            changeType === 'negative' ? 'bg-red-50 text-red-500' :
            'bg-gray-50 text-gray-400'
          }`}>{change}</span>
        )}
      </div>
      <div className="text-4xl font-bold text-[#1A1A2E] tracking-tight">{value}</div>
      <div className="text-base text-gray-400 mt-1.5">{title}</div>
    </motion.div>
  );
}
