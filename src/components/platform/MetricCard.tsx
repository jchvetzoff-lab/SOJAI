'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  color?: string;
}

export default function MetricCard({ title, value, subtitle, trend, icon, color = '#5B5BD6' }: MetricCardProps) {
  return (
    <div className="bg-[#141416] rounded-lg p-4 border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200">
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-8 h-8 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${color}18`, color }}
        >
          {icon}
        </div>
        <span className="text-[12px] text-[#5C5C5F] font-medium">{title}</span>
      </div>
      <div className="text-2xl font-semibold text-[#EDEDEF] tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-1.5">
        {subtitle && <span className="text-[11px] text-[#5C5C5F]">{subtitle}</span>}
        {trend && (
          <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded ${
            trend.positive ? 'bg-[#30A46C]/10 text-[#30A46C]' : 'bg-[#E5484D]/10 text-[#E5484D]'
          }`}>
            {trend.positive ? '\u2191' : '\u2193'} {trend.value}
          </span>
        )}
      </div>
    </div>
  );
}
