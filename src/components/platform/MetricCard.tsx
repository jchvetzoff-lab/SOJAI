'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  color?: string;
}

export default function MetricCard({ title, value, subtitle, trend, icon, color = '#4A39C0' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-3xl p-7 border border-black/[0.06] shadow-sm hover:shadow-xl hover:shadow-[#4A39C0]/[0.06] transition-shadow duration-300"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${color}12`, color }}
        >
          {icon}
        </div>
        <span className="text-base text-gray-400 font-medium">{title}</span>
      </div>
      <div className="text-4xl font-bold text-[#1A1A2E] tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-2">
        {subtitle && <span className="text-sm text-gray-400">{subtitle}</span>}
        {trend && (
          <span className={`text-sm font-semibold px-2.5 py-1 rounded-full ${
            trend.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
