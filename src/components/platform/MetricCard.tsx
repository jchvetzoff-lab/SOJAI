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
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {icon}
        </div>
        <span className="text-sm text-gray-500">{title}</span>
      </div>
      <div className="text-3xl font-bold text-[#1A1A2E]">{value}</div>
      <div className="flex items-center justify-between mt-1">
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
        {trend && (
          <span className={`text-xs font-medium ${trend.positive ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
