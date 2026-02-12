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

export default function MetricCard({ title, value, subtitle, trend, icon, color = '#3B82F6' }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-[#111C32] rounded-2xl p-6 border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {icon}
        </div>
        <span className="text-sm text-[#64748B] font-medium">{title}</span>
      </div>
      <div className="text-3xl font-bold text-[#E2E8F0] tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-2">
        {subtitle && <span className="text-xs text-[#475569]">{subtitle}</span>}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {trend.positive ? '\u2191' : '\u2193'} {trend.value}
          </span>
        )}
      </div>
    </motion.div>
  );
}
